"use client";

import { useState, useRef } from "react";
import { useEffect } from "react";
import TextForm from "@/components/layouts/TextForm";
import ImageUpload from "@/components/layouts/ImageUpload";
import {
  CategoryForm,
  NativeSelectOption,
  NativeSelectOptGroup,
} from "@/components/layouts/CategoryForm";
import { CompanyEdit, CompanyEditRequest } from "@/lib/api/company-edit";
import { UpdateGoods, UpdateGoodsRequest } from "@/lib/api/update-goods";
import { getCompanyDetail } from "@/lib/api/company";
import PrimaryButton from "@/components/elements/PrimaryButton";
import { useSession } from "@/lib/auth-client";
import { GoogleMap, Marker, useJsApiLoader, StandaloneSearchBox } from "@react-google-maps/api";
import { useTranslations } from "next-intl";

// TODO: レオタスク
export default function EditPage() {
  const t = useTranslations();
  const { data } = useSession();
  // companyのフォーム情報
  const [company, setCompany] = useState<CompanyEditRequest>({
    companyName: "",
    companyCategory: "",
    imageFile: new Blob(),
    placeId: "",
  });

  // goodsのフォーム情報
  const [goods, setGoods] = useState<UpdateGoodsRequest>({
    name: "",
    images: [],
    deleteImageIds: [],
  });
  // 画像のURL（フォームの画像のURL）
  const [imageUrls, setImageUrls] = useState({
    companyImageUrl: "",
    goodsImageUrl: "",
  });
  const [goodsId, setGoodsId] = useState("");

  const handleSubmit = async () => {
    try {
      const result = await CompanyEdit(company);
      const result2 = await UpdateGoods(goods, goodsId);
      // nullチェック
      if (result?.success && result2?.success) {
        alert(t("admin.editSuccess"));
      } else {
        alert(t("admin.editFailed"));
      }
    } catch (err) {
      console.error(err);
      alert(t("admin.communicationError"));
    }
  };

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

  const handleIndex = async () => {
    if (!data?.user.id) return;
    const res = await getCompanyDetail(data?.user.id);
    if (res.success === false) {
      // TODO: alertを良いUIに変更する。
      alert(res.message);
      return;
    }
    setCompany({
      companyName: res.data.companyName,
      companyCategory: res.data.companyCategory,
      // placeUrl: res.data.placeUrl,
      // ここに画像ファイルを入れる。
      imageFile: new Blob(),
      placeId: res.data.placeId,
    });
    setImageUrls({
      companyImageUrl: res.data.imageUrl,
      goodsImageUrl: res.data.goods?.imageUrl || "",
    });

    if (!res.data.goods) return;
    setGoods({
      name: res.data.goods.name,
      images: [],
      deleteImageIds: [res.data.goods.id],
    });
    setGoodsId(res.data.goods.id);
  };

  useEffect(() => {
    handleIndex();
  }, [data]);

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
    <div className="flex flex-col justify-center gap-6 pb-[104px] pt-10">
      <p className="flex justify-center items-center text-2xl font-bold">{t("admin.editTitle")}</p>
      <TextForm
        label={t("admin.storeName")}
        type="text"
        placeholder={t("admin.storeNamePlaceholder")}
        value={company.companyName}
        onChange={(e) => setCompany({ ...company, companyName: e.target.value })}
      />
      {/* <TextForm label="住所" type="text" placeholder="例 名古屋市中村区日本橋1-1" value={company.placeUrl} onChange={(e) => setCompany({ ...company, PlaceUrl: e.target.value })} /> */}
      {isLoaded && (
        <>
          {company.placeId ? (
            <div className="relative">
              <div
                className="absolute inset-0 z-20"
                onClick={() =>
                  setCompany({
                    ...company,
                    placeId: "",
                  })
                }
              />
              <TextForm
                label={t("admin.mapUrl")}
                value={`https://www.google.com/maps/place?place_id:${company.placeId}`}
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
                  placeholder={t("admin.searchLocation")}
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
                    alert(t("admin.selectLocation"));
                    return;
                  }
                  setCompany({
                    ...company,
                    // @ts-ignore
                    placeId: selectedPlaceId,
                  });
                }}
              >
                {t("admin.setHere")}
              </button>
            </GoogleMap>
          )}
        </>
      )}
      <CategoryForm
        title={t("admin.companyCategory")}
        value={company.companyCategory}
        onChange={(e) => setCompany({ ...company, companyCategory: e.target.value })}
      >
        <NativeSelectOptGroup label={t("admin.companyCategory")}>
          <NativeSelectOption value="1">{t("admin.categoryFood")}</NativeSelectOption>
          <NativeSelectOption value="2">{t("admin.categoryCulture")}</NativeSelectOption>
          <NativeSelectOption value="3">{t("admin.categoryWorkshop")}</NativeSelectOption>
          <NativeSelectOption value="4">{t("admin.categoryShopping")}</NativeSelectOption>
          <NativeSelectOption value="5">{t("admin.categoryOther")}</NativeSelectOption>
        </NativeSelectOptGroup>
      </CategoryForm>
      <TextForm label={t("admin.sns")} type="text" placeholder={t("admin.snsPlaceholder")} />
      <ImageUpload
        label={t("admin.storeImage")}
        title={t("admin.uploadImage")}
        preview={imageUrls.companyImageUrl || undefined}
        onChange={(file) => {
          if (!file) return;
          const url = URL.createObjectURL(file);
          setImageUrls({
            ...imageUrls,
            companyImageUrl: url,
          });
          setCompany({ ...company, imageFile: file });
        }}
      />
      <TextForm
        label={t("admin.goodsName")}
        type="text"
        placeholder={t("admin.goodsNamePlaceholder")}
        value={goods.name}
        onChange={(e) => setGoods({ ...goods, name: e.target.value })}
      />
      <ImageUpload
        label={t("admin.goodsImage")}
        title={t("admin.uploadImage")}
        preview={imageUrls.goodsImageUrl || undefined}
        onChange={(file) => {
          if (!file) return;
          const url = URL.createObjectURL(file);
          setImageUrls({
            ...imageUrls,
            goodsImageUrl: url,
          });
          setGoods({ ...goods, images: [file] });
        }}
      />
      <PrimaryButton text={t("admin.updateButton")} onClick={handleSubmit} />
    </div>
  );
}
