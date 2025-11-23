'use client';

import { useRef, useState } from "react";
import TextForm from "@/components/layouts/TextForm";
import ImageUpload from "@/components/layouts/ImageUpload";
import { CategoryForm, NativeSelectOption, NativeSelectOptGroup } from "@/components/layouts/CategoryForm";
import { companyCreate, CompanyCreateRequest } from "@/lib/api/company-create"
import { useRouter } from "next/navigation";
import PrimaryButton from "@/components/elements/PrimaryButton"
import {
    GoogleMap,
    Marker,
    useJsApiLoader,
    StandaloneSearchBox,
} from "@react-google-maps/api";

export default function StoreInformationCreationPage() {
    const [preview, setPreview] = useState<string | null>(null);
    const [form, setForm] = useState<CompanyCreateRequest>({
        companyName: "",
        companyCategory: "",
        placeId: "",
        placeUrl: "",
        imageFile: new Blob(),
    });
    // 地図選択系
    const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
    const [center, setCenter] = useState({
        lat: 35.6895,
        lng: 139.6917,
    });
    const [position, setPosition] = useState<{
        lat: number;
        lng: number;
    }>();
    const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
        libraries: ["places"],
        language: "ja",
    });

    const router = useRouter();

    const handleSubmit = async () => {
        if (!form.companyName || !form.companyCategory || !form.imageFile) {
            alert("会社名・カテゴリー・画像は必須です");
            return;
        }

        const result = await companyCreate(form);

        if (result.success) {
            router.push("/admin/auth/goods-register");
        } else {
            alert(result.message);
        }
    }

    const onPlacesChanged = () => {
        if (searchBoxRef.current) {
            const places = searchBoxRef.current.getPlaces();
            if (places && places.length > 0) {
                const place = places[0];
                if (place.geometry?.location) {
                    const newPosition = {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                    };

                    setCenter(newPosition);
                    setPosition(newPosition);
                    setSelectedPlaceId(place.place_id || "");
                } else {
                    // geometry/location がない場合のエラーハンドリング
                    console.warn("Selected place has no geometry/location.");
                }
            }
        }
    };

    return (
        <div className="flex flex-col justify-center gap-6">

            <h1 className="flex justify-center font-bold text-2xl py-5">店舗登録</h1>
            <TextForm label="店舗名" type="text" placeholder="例 ご飯大好きの会" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            {/* <TextForm label="住所" type="text" placeholder="例 名古屋市中村区日本橋1-1" value={form.placeUrl} onChange={(e) => setForm({ ...form, placeUrl: e.target.value })} /> */}
            <CategoryForm title="カテゴリー" defaultValue="1" onChange={(e) => setForm({ ...form, companyCategory: e.target.value })} >
                <NativeSelectOptGroup label="カテゴリー">
                    <NativeSelectOption value="1">飲食</NativeSelectOption>
                    <NativeSelectOption value="2">文化・歴史</NativeSelectOption>
                    <NativeSelectOption value="3">ものづくり・ワークショップ</NativeSelectOption>
                    <NativeSelectOption value="4">買い物</NativeSelectOption>
                    <NativeSelectOption value="5">その他</NativeSelectOption>
                </NativeSelectOptGroup>
            </CategoryForm>
            {isLoaded && (
                <>
                    {form.placeUrl ? (
                        <div className="relative">
                            <div className="absolute inset-0 z-20" onClick={() => setForm({
                                ...form,
                                placeId: ""
                            })} />
                            <TextForm
                                label="MapUrl"
                                value={form.placeUrl}
                                readOnly
                            />
                        </div>
                    ) : (
                        <GoogleMap
                            mapContainerStyle={{
                                width: "100%",
                                height: "500px",
                            }}
                            center={center}
                            zoom={16}
                            options={{
                                controlSize: 24,
                            }}
                            onClick={(e: google.maps.MapMouseEvent) => {
                                if (e.latLng) {
                                    console.log(e);
                                    const lat = e.latLng.lat();
                                    const lng = e.latLng.lng();
                                    const newPosition = { lat, lng };
                                    setPosition(newPosition);
                                    onPlacesChanged();
                                    // @ts-ignore
                                    setSelectedPlaceId(e.placeId || "");
                                }
                            }}
                        >
                            <StandaloneSearchBox
                                onLoad={(ref) => (searchBoxRef.current = ref)}
                                onPlacesChanged={onPlacesChanged}
                            >
                                <input
                                    type="text"
                                    placeholder="場所を検索..."
                                    style={{
                                        backgroundColor: "white",
                                        boxSizing: "border-box",
                                        border: "1px solid transparent",
                                        width: "240px",
                                        height: "32px",
                                        padding: "0 12px",
                                        borderRadius: "3px",
                                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                                        fontSize: "14px",
                                        outline: "none",
                                        textOverflow: "ellipses",
                                        position: "absolute",
                                        left: "50%",
                                        marginLeft: "-120px",
                                        top: "10px",
                                    }}
                                />
                            </StandaloneSearchBox>
                            {position && <Marker position={position} />}
                            <button
                                className="absolute right-4 bottom-4 bg-primary text-white py-2 px-6"
                                onClick={() => {
                                    if (!selectedPlaceId) {
                                        alert("場所を選択してください");
                                        return;
                                    }
                                    setForm({
                                        ...form,
                                        // @ts-ignore
                                        placeId: selectedPlaceId,
                                        placeUrl: `https://www.google.com/maps/place?place_id:${form.placeId}`
                                    });
                                }}
                            >
                                ここにする
                            </button>
                        </GoogleMap>
                    )}
                </>
            )}
            <ImageUpload
                label="店舗画像"
                title="画像をアップロード"
                preview={preview ?? undefined}
                onChange={(file) => {
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    setPreview(url);
                    setForm({
                        ...form,
                        imageFile: file
                    });
                }}
            />
            <PrimaryButton
                text="登録"
                onClick={handleSubmit}
            />
        </div>
    )
}