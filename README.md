This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

output :

<img width="1919" height="798" alt="image" src="https://github.com/user-attachments/assets/f795f27a-95ba-4040-9274-923eea30baf2" />


<img width="1880" height="867" alt="image" src="https://github.com/user-attachments/assets/38263ce6-ae57-4ea6-9b7a-72575e588157" />

<img width="1893" height="881" alt="image" src="https://github.com/user-attachments/assets/b11f3773-d834-4166-ab7d-4ff7154c94f2" />

<img width="1903" height="875" alt="image" src="https://github.com/user-attachments/assets/340077ce-7d9a-4f13-89ef-f7d4293a7928" />


<img width="901" height="670" alt="image" src="https://github.com/user-attachments/assets/b676a3f5-5e6a-4425-aefa-d02822532157" />

<img width="1889" height="589" alt="image" src="https://github.com/user-attachments/assets/64745b8f-88d9-44c7-a3b0-49651e1e2c53" />

<img width="1919" height="802" alt="image" src="https://github.com/user-attachments/assets/992d15c7-ee6d-41af-ab60-ca5159849f1a" />

<img width="1898" height="862" alt="image" src="https://github.com/user-attachments/assets/d7944e89-6119-41c2-8dc9-a734c0369b99" />


<img width="1909" height="820" alt="image" src="https://github.com/user-attachments/assets/a9751200-cbde-4614-a4ba-65bfcd56599c" />

<img width="764" height="412" alt="image" src="https://github.com/user-attachments/assets/3a953848-11a2-4153-acba-f56d9ab67110" />












attendance-management/
│
├── README.md
├── package.json
├── tsconfig.json
├── next.config.js
├── .gitignore
├── .env.example
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   │
│   │   ├── teacher/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── students/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── add/page.tsx
│   │   │   │   └── edit/[id]/page.tsx
│   │   │   ├── batches/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── add/page.tsx
│   │   │   │   └── edit/[id]/page.tsx
│   │   │   ├── attendance/page.tsx
│   │   │   └── reports/page.tsx
│   │   │
│   │   ├── student/
│   │   │   └── dashboard/page.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── register/route.ts
│   │   │   │
│   │   │   ├── students/
│   │   │   │   ├── add/route.ts
│   │   │   │   ├── list/route.ts
│   │   │   │   └── delete/[id]/route.ts
│   │   │   │
│   │   │   ├── batches/
│   │   │   │   ├── add/route.ts
│   │   │   │   ├── list/route.ts
│   │   │   │   ├── edit/[id]/route.ts
│   │   │       └── delete/[id]/route.ts
│   │   │
│   │   │   ├── attendance/
│   │   │   │   ├── mark/route.ts
│   │   │   │   ├── students/[batchId]/route.ts
│   │   │   │   └── history/[batchId]/route.ts
│   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── teacher/route.ts
│   │   │   │   └── student/route.ts
│   │   │
│   │   │   ├── reports/
│   │   │   │   └── attendance/route.ts
│   │   │
│   │   │   └── docs/route.ts  (Swagger JSON)
│   │   │
│   │   └── styles/
│   │       └── globals.css
│   │
│   ├── lib/
│   │   ├── db.ts
│   │   ├── auth.ts
│   │   ├── bcrypt.ts
│   │   ├── response.ts
│   │   └── jwt.ts
│   │
│   ├── middleware/
│   │   └── errorHandler.ts
│   │
│   └── utils/
│       └── validate.ts
│
└── postman/
    └── attendance-collection.json





---

# 🔥 API Endpoints Overview

## 🔑 Auth API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login (Teacher + Student) |
| POST | `/api/auth/register` | Teacher Registration |

---

## 👨‍🏫 Teacher – Students API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students/list` | Get all students |
| POST | `/api/students/add` | Add student |
| DELETE | `/api/students/delete/:id` | Delete student |

---

## 🎓 Batches API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/batches/list` | Get all batches |
| POST | `/api/batches/add` | Create batch |
| PUT | `/api/batches/edit/:id` | Update batch |
| DELETE | `/api/batches/delete/:id` | Delete batch |

---

## 🗓 Attendance API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attendance/students/:batchId` | Get all batch students |
| POST | `/api/attendance/mark` | Mark attendance |
| GET | `/api/attendance/history/:batchId` | View history |

---

## 📊 Dashboard API
| Endpoint | Description |
|----------|-------------|
| `/api/dashboard/teacher` | Teacher dashboard stats |
| `/api/dashboard/student` | Student-specific stats |

---

## 📈 Reports API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reports/attendance` | Generate attendance report |

---

🔐 .env Configuration

Create a .env file:

DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/attendance_db"

JWT_SECRET="your-secret-key-here"
JWT_REFRESH_SECRET="your-refresh-secret"

NEXTAUTH_SECRET="random-value"

PORT=3000
NODE_ENV=development








You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
