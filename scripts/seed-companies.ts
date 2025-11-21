/**
 * カンパニーユーザー作成 & サーベイ作成シーダースクリプト
 * 
 * 使い方:
 * 1. アプリケーションを起動: pnpm run dev
 * 2. 別ターミナルで実行: npx tsx scripts/seed-companies.ts
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const NUM_COMPANIES = 5; // 作成するカンパニー数
const SURVEYS_PER_COMPANY = 5; // 各カンパニーが作成するサーベイ数

type CompanyCategory = "food" | "culture" | "activity" | "shopping" | "other";
type Gender = "male" | "female" | "other";
type AgeGroup = "18-24" | "25-34" | "35-44" | "45-54" | "55+";

interface CompanyData {
  email: string;
  password: string;
  companyName: string;
  companyCategory: CompanyCategory;
}

interface SurveyData {
  description: string;
  gender: Gender;
  ageGroup: AgeGroup;
  satisfactionLevel: number;
  country: string;
}

// カンパニーデータの定義
const companies: CompanyData[] = [
  {
    email: "ramen.tokyo@example.com",
    password: "Password123!",
    companyName: "Tokyo Ramen House",
    companyCategory: "food",
  },
  {
    email: "kyoto.temple@example.com",
    password: "Password123!",
    companyName: "Kyoto Cultural Experience",
    companyCategory: "culture",
  },
  {
    email: "osaka.adventure@example.com",
    password: "Password123!",
    companyName: "Osaka Adventure Tours",
    companyCategory: "activity",
  },
  {
    email: "shibuya.shop@example.com",
    password: "Password123!",
    companyName: "Shibuya Fashion Mall",
    companyCategory: "shopping",
  },
  {
    email: "hokkaido.experience@example.com",
    password: "Password123!",
    companyName: "Hokkaido Experience Center",
    companyCategory: "other",
  },
];

// サーベイデータのテンプレート
const surveyTemplates = [
  {
    description: "Great experience! The food was amazing and the service was excellent.",
    gender: "female" as Gender,
    ageGroup: "25-34" as AgeGroup,
    satisfactionLevel: 5,
    country: "USA",
  },
  {
    description: "Very satisfied with the overall experience. Will come back again!",
    gender: "male" as Gender,
    ageGroup: "35-44" as AgeGroup,
    satisfactionLevel: 4,
    country: "UK",
  },
  {
    description: "Nice atmosphere and friendly staff. Highly recommended!",
    gender: "other" as Gender,
    ageGroup: "18-24" as AgeGroup,
    satisfactionLevel: 5,
    country: "Australia",
  },
  {
    description: "Good quality but a bit pricey. Overall worth the visit.",
    gender: "male" as Gender,
    ageGroup: "45-54" as AgeGroup,
    satisfactionLevel: 3,
    country: "Canada",
  },
  {
    description: "Absolutely loved it! Unique and authentic experience.",
    gender: "female" as Gender,
    ageGroup: "55+" as AgeGroup,
    satisfactionLevel: 5,
    country: "Germany",
  },
];

/**
 * カンパニーユーザーを作成
 */
async function createCompanyUser(companyData: CompanyData): Promise<{ userId: string; token: string } | null> {
  try {
    console.log(`Creating company: ${companyData.companyName}...`);
    
    // サインアップ
    const signupResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: companyData.email,
        password: companyData.password,
        accountType: "company",
        companyName: companyData.companyName,
        companyCategory: companyData.companyCategory,
      }),
    });

    if (!signupResponse.ok) {
      const error = await signupResponse.json();
      console.error(`Failed to create company ${companyData.companyName}:`, error);
      return null;
    }

    const signupResult = await signupResponse.json();
    console.log(`✓ Company created: ${companyData.companyName}`);

    // ログイン（セッショントークンを取得）
    const loginResponse = await fetch(`${BASE_URL}/api/auth/sign-in/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: companyData.email,
        password: companyData.password,
      }),
    });

    if (!loginResponse.ok) {
      console.error(`Failed to login as ${companyData.companyName}`);
      return null;
    }

    // Set-Cookieヘッダーからトークンを取得
    const setCookie = loginResponse.headers.get("set-cookie");
    let token = "";
    if (setCookie) {
      const match = setCookie.match(/better-auth\.session_token=([^;]+)/);
      if (match) {
        token = match[1];
      }
    }

    return {
      userId: signupResult.user.id,
      token,
    };
  } catch (error) {
    console.error(`Error creating company ${companyData.companyName}:`, error);
    return null;
  }
}

/**
 * サーベイを作成
 */
async function createSurvey(
  companyName: string,
  token: string,
  surveyData: SurveyData
): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/surveys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `better-auth.session_token=${token}`,
      },
      body: JSON.stringify(surveyData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error(`Failed to create survey for ${companyName}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error creating survey for ${companyName}:`, error);
    return false;
  }
}

/**
 * メイン処理
 */
async function main() {
  console.log("========================================");
  console.log("Starting seeding process...");
  console.log(`Creating ${NUM_COMPANIES} companies with ${SURVEYS_PER_COMPANY} surveys each`);
  console.log("========================================\n");

  let totalCompaniesCreated = 0;
  let totalSurveysCreated = 0;

  for (let i = 0; i < Math.min(NUM_COMPANIES, companies.length); i++) {
    const companyData = companies[i];
    
    // カンパニーユーザー作成
    const result = await createCompanyUser(companyData);
    if (!result) {
      console.log(`⚠️  Skipping survey creation for ${companyData.companyName}\n`);
      continue;
    }

    totalCompaniesCreated++;
    const { token } = result;

    // サーベイ作成
    console.log(`Creating ${SURVEYS_PER_COMPANY} surveys for ${companyData.companyName}...`);
    for (let j = 0; j < SURVEYS_PER_COMPANY; j++) {
      const surveyData = surveyTemplates[j % surveyTemplates.length];
      const success = await createSurvey(companyData.companyName, token, surveyData);
      
      if (success) {
        totalSurveysCreated++;
        console.log(`  ✓ Survey ${j + 1}/${SURVEYS_PER_COMPANY} created`);
      } else {
        console.log(`  ✗ Survey ${j + 1}/${SURVEYS_PER_COMPANY} failed`);
      }
    }

    console.log(`✓ Completed ${companyData.companyName}\n`);
  }

  console.log("========================================");
  console.log("Seeding completed!");
  console.log(`Companies created: ${totalCompaniesCreated}/${NUM_COMPANIES}`);
  console.log(`Surveys created: ${totalSurveysCreated}/${NUM_COMPANIES * SURVEYS_PER_COMPANY}`);
  console.log("========================================");
}

// スクリプト実行
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
