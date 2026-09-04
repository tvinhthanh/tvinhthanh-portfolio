import { t, type L } from "@/lib/i18n";

/**
 * Every word on the site lives here, in both languages.
 *
 * Section names stay professional. The world only ever speaks in the small
 * secondary label underneath — a recruiter reads "Projects", the atmosphere
 * lives in the line below it.
 */

export const profile = {
  name: "Trương Vĩnh Thành",
  nameLatin: "Truong Vinh Thanh",
  initials: "TVT",

  discipline: t(
    "Frontend Engineer · Full-stack Software Engineer",
    "Frontend Engineer · Kỹ sư phần mềm Full-stack",
  ),
  role: t(
    "Frontend Engineer · Full-stack Software Engineer",
    "Frontend Engineer · Kỹ sư phần mềm Full-stack",
  ),
  statement: t(
    "Building scalable products, intelligent systems, and digital experiences from interface to infrastructure.",
    "Xây dựng sản phẩm có khả năng mở rộng, hệ thống thông minh và trải nghiệm số — từ giao diện xuống tới hạ tầng.",
  ),

  location: t("Ho Chi Minh City", "TP. Hồ Chí Minh"),
  locationFull: t("Ho Chi Minh City, Vietnam", "TP. Hồ Chí Minh, Việt Nam"),
  availability: t("Available for opportunities", "Sẵn sàng cho cơ hội mới"),
  headline: "React · Next.js · TypeScript · Tailwind",

  email: "tvinhthanhsg@gmail.com",
  phone: "+84 797 200 168",
  phoneHref: "+84797200168",
  github: "tvinhthanh",
  githubUrl: "https://github.com/tvinhthanh",
  linkedinUrl:
    "https://www.linkedin.com/in/v%C4%A9nh-th%C3%A0nh-tr%C6%B0%C6%A1ng-44a62b343",
  siteUrl: "https://truongvinhthanh.dev",

  intro: t(
    "I build business systems: rental, point-of-sale, warehouse, e-commerce. The part I care about is the part that usually gets skipped — the data model, where the transaction boundary sits, and what the system does when the happy path doesn't happen.",
    "Tôi làm hệ thống nghiệp vụ: cho thuê xe, bán hàng tại quầy, kho, thương mại điện tử. Phần tôi quan tâm lại là phần hay bị bỏ qua — mô hình dữ liệu, ranh giới transaction nằm ở đâu, và hệ thống xử lý thế nào khi luồng thuận lợi không xảy ra.",
  ),
  introSecondary: t(
    "Lately most of my time goes to AI coding agents: reusable skill packs and workflow rules that make an agent behave like a senior engineer instead of a code generator.",
    "Gần đây phần lớn thời gian của tôi dành cho AI coding agent: các skill pack dùng lại được và bộ quy tắc workflow, để agent hành xử như một kỹ sư senior chứ không phải máy sinh code.",
  ),

  facts: [
    { label: t("Role", "Vai trò"), value: t("Frontend Engineer · Full-stack Software Engineer", "Frontend Engineer · Kỹ sư phần mềm Full-stack") },
    { label: t("Based in", "Ở tại"), value: t("Ho Chi Minh City, Vietnam", "TP. Hồ Chí Minh, Việt Nam") },
    { label: t("Experience", "Kinh nghiệm"), value: t("3+ years in production", "3+ năm với sản phẩm chạy thật") },
    { label: t("Public repositories", "Repository công khai"), value: t("31 on GitHub", "31 trên GitHub") },
    { label: t("Languages", "Ngôn ngữ"), value: t("Vietnamese, English", "Tiếng Việt, tiếng Anh") },
  ],
};

/* ------------------------------------------------------------------ *
 * Navigation. `aside` is the world's name for the section — it never  *
 * replaces the real one.                                              *
 * ------------------------------------------------------------------ */

export type PageLink = { id: string; label: L; aside: L };

export const pages: PageLink[] = [
  { id: "home", label: t("Home", "Trang chủ"), aside: t("Overview", "Tổng quan") },
  { id: "intro", label: t("Intro", "Giới thiệu"), aside: t("Engineer Profile", "Hồ sơ kỹ sư") },
  { id: "philosophy", label: t("Philosophy", "Triết lý"), aside: t("Engineering Principles", "Nguyên tắc kỹ thuật") },
  { id: "projects", label: t("Projects", "Dự án"), aside: t("Featured Works", "Dự án tiêu biểu") },
  { id: "experience", label: t("Experience", "Kinh nghiệm"), aside: t("Career Path", "Quá trình làm việc") },
  { id: "stack", label: t("Stack", "Công nghệ"), aside: t("Tools & Capabilities", "Công nghệ & Kỹ năng") },
  { id: "background", label: t("Background", "Nền tảng"), aside: t("Education & Languages", "Học vấn & Ngôn ngữ") },
  { id: "contact", label: t("Contact", "Liên hệ"), aside: t("Get in Touch", "Kênh kết nối") },
];

/* ------------------------------------------------------------------ *
 * The thesis. Everything else on the page is evidence for it.         *
 * ------------------------------------------------------------------ */

export const philosophy = {
  eyebrow: t("Core engineering principles across frontend & backend", "Nguyên tắc kỹ thuật xuyên suốt frontend và backend"),
  statement: t(
    "Data integrity at the system boundary, deterministic state fidelity at the interface.",
    "Bảo toàn tính đúng đắn ở tầng dữ liệu, chuẩn xác và mượt mà ở tầng giao diện người dùng.",
  ),
  closing: t(
    "Whether it is an immutable database ledger or a resilient client state machine, shortcuts taken at the data layer always become expensive bugs at the interface.",
    "Dù là một cột sổ cái bất biến phía backend hay một state machine chặt chẽ phía frontend, mọi lối tắt ở tầng dữ liệu đều sẽ trở thành lỗi đắt giá ngay trên trải nghiệm người dùng.",
  ),
  examples: [
    {
      where: t("UI State & Hydration", "State giao diện & Hydration"),
      how: t(
        "Client state is a deterministic projection of server truth, never a desynchronised parallel copy. Form drafts and user inputs snapshot locally so network drops or hydration never wipe user keystrokes.",
        "State giao diện là hình chiếu chuẩn xác từ server, không lưu bản sao song song dễ lệch nhau. Bản nháp form và thao tác được snapshot cục bộ để mất mạng hay hydration cũng không bao giờ mất dữ liệu người dùng nhập.",
      ),
    },
    {
      where: t("Optimistic UI & Rollback", "UI Lạc quan & Hoàn tác"),
      how: t(
        "Immediate UI feedback keeps interactions instant and fluid, but every mutation carries an explicit compensation rollback. The interface never falsely claims success until the server commits.",
        "Cập nhật giao diện tức thì cho trải nghiệm mượt mà, nhưng mọi thao tác đột biến đều có cơ chế rollback tường minh nếu server từ chối. Giao diện không bao giờ tự nhận thành công trước khi hệ thống xác nhận.",
      ),
    },
    {
      where: t("Layout & Performance", "Hiệu năng hiển thị & Layout"),
      how: t(
        "Every dynamic container reserves exact dimensions up-front to guarantee 0 Cumulative Layout Shift (CLS). Critical content renders server-side (SSR) while heavy visual assets stream asynchronously.",
        "Mọi khung hình chuyển đổi đều giữ chỗ kích thước chuẩn để tránh giật nhảy giao diện (CLS = 0). Nội dung cốt lõi render phía server (SSR), các thành phần đồ họa nặng được stream bất đồng bộ.",
      ),
    },
    {
      where: t("Error Boundaries & Offline", "Phân tách lỗi & Ngoại tuyến"),
      how: t(
        "Every critical user journey is wrapped with granular error boundaries and explicit permission/empty states. A failed microservice or third-party script never white-screens the application.",
        "Mỗi luồng người dùng đều có Error Boundary cô lập cùng trạng thái lỗi/rỗng rõ ràng. Một API bên thứ ba gặp sự cố không bao giờ làm trắng toàn bộ trang web.",
      ),
    },
    {
      where: t("Point of sale", "Bán hàng tại quầy"),
      how: t(
        "The cashbook rejects UPDATE and DELETE. Order lines snapshot price and cost at the moment of sale, so changing a recipe next month cannot rewrite last month's profit.",
        "Sổ quỹ từ chối UPDATE và DELETE. Dòng đơn hàng chụp lại giá bán và giá vốn ngay lúc bán, nên tháng sau sửa công thức cũng không viết lại được lợi nhuận tháng trước.",
      ),
    },
    {
      where: t("POS on Supabase", "POS trên Supabase"),
      how: t(
        "The same rules pushed down into Postgres triggers and row-level security — where a future endpoint cannot forget to call them.",
        "Cùng bộ quy tắc đó đẩy xuống trigger Postgres và row-level security — nơi mà một endpoint viết sau này không thể quên gọi.",
      ),
    },
    {
      where: t("Warehouse", "Kho"),
      how: t(
        "InventoryLog is the truth; the current stock figure is a position derived from it. Stock takes record the difference instead of overwriting it.",
        "InventoryLog mới là sự thật; con số tồn hiện tại chỉ là trạng thái suy ra từ đó. Kiểm kê ghi lại phần chênh lệch thay vì ghi đè.",
      ),
    },
    {
      where: t("Vehicle rental", "Cho thuê xe"),
      how: t(
        "Handover and return are two separately dated condition records. Rental disputes are never about the rate — they are about whether that scratch was already there.",
        "Giao xe và nhận xe là hai bản ghi tình trạng có ngày riêng. Tranh chấp thuê xe chưa bao giờ nằm ở giá — nó nằm ở vết xước kia đã có sẵn hay chưa.",
      ),
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Experience                                                          *
 * ------------------------------------------------------------------ */

export type Role = {
  id: string;
  company: string;
  title: L;
  start: string;
  end: string | null;
  location: L;
  summary: L;
  work: L[];
  stack: string[];
};

export const roles: Role[] = [
  {
    id: "thangchin",
    company: "TGR Fusion",
    title: t("Full-stack developer", "Full-stack developer"),
    start: "2025-06",
    end: null,
    location: t("Ho Chi Minh City", "TP. Hồ Chí Minh"),
    summary: t(
      "Own frontend delivery for production applications and work across the NestJS services behind them — from responsive UI through API integration to release support.",
      "Phụ trách phần frontend của các ứng dụng chạy thật, đồng thời làm cả những service NestJS phía sau — từ dựng UI responsive, tích hợp API cho tới hỗ trợ release.",
    ),
    work: [
      t(
        "Own frontend delivery for production applications using React, Next.js, and TypeScript — from responsive UI through API integration to release support.",
        "Phụ trách phần frontend của các ứng dụng chạy thật bằng React, Next.js và TypeScript — từ dựng UI responsive, tích hợp API cho tới hỗ trợ release.",
      ),
      t(
        "Build complex user journeys for authentication, payments, wallets, content access and account verification, each with explicit loading, error and permission states.",
        "Dựng các luồng người dùng phức tạp cho đăng nhập, thanh toán, ví, quyền truy cập nội dung và xác minh tài khoản — mỗi màn đều có trạng thái loading, lỗi và phân quyền rõ ràng.",
      ),
      t(
        "Design and integrate RESTful APIs, webhooks and WebSocket events while collaborating across Node.js/NestJS backend services.",
        "Thiết kế và tích hợp RESTful API, webhook và sự kiện WebSocket phối hợp chặt chẽ với các service Node.js/NestJS.",
      ),
      t(
        "Ship real-time and event-driven features with WebSocket, BullMQ and Redis for interactive experiences and asynchronous processing.",
        "Làm tính năng real-time và event-driven bằng WebSocket, BullMQ và Redis cho trải nghiệm tương tác và xử lý bất đồng bộ.",
      ),
      t(
        "Integrate OpenAI and Whisper for translation, transcription and content workflows, validating both the integration and its output through testing and human review.",
        "Tích hợp OpenAI và Whisper cho luồng dịch, bóc băng và nội dung; kiểm chứng cả phần tích hợp lẫn kết quả đầu ra bằng test và rà soát thực tế.",
      ),
      t(
        "Improve discoverability and runtime performance through SSR, metadata and sitemap work, Redis caching, bundle optimisation and Core Web Vitals.",
        "Cải thiện khả năng tìm thấy và hiệu năng runtime qua SSR, metadata, sitemap, cache Redis, tối ưu bundle và Core Web Vitals.",
      ),
      t(
        "Raise release confidence with Playwright end-to-end tests, collaborate via Git/Jira, and support React Native mobile development when needed.",
        "Tăng độ tin cậy khi release bằng test end-to-end Playwright, phối hợp qua Git/Jira, và hỗ trợ phát triển tính năng mobile bằng React Native khi cần.",
      ),
    ],
    stack: ["React", "Next.js", "TypeScript", "NestJS", "Node.js", "Redis", "BullMQ", "WebSocket", "Playwright", "Docker", "React Native"],
  },
  {
    id: "playouu",
    company: "Playouu Company",
    title: t("Frontend developer", "Frontend developer"),
    start: "2024-06",
    end: "2025-07",
    location: t("Ho Chi Minh City", "TP. Hồ Chí Minh"),
    summary: t(
      "Built production web applications across social, e-commerce and interactive product features, plus the reusable UI system underneath them.",
      "Xây các ứng dụng web chạy thật cho mảng social, thương mại điện tử và tính năng tương tác, cùng hệ UI dùng lại được bên dưới.",
    ),
    work: [
      t(
        "Created reusable UI systems including dashboards, charts, filters, forms and data-heavy components shared across several product areas.",
        "Dựng hệ thống UI dùng lại được gồm dashboard, biểu đồ, bộ lọc, form và các component nhiều dữ liệu dùng chung.",
      ),
      t(
        "Integrated RESTful APIs, WebSocket events, caching and database-driven flows for responsive, real-time experiences.",
        "Tích hợp RESTful API, sự kiện WebSocket, caching và các luồng dữ liệu để có trải nghiệm real-time mượt mà.",
      ),
      t(
        "Contributed Flutter mobile features and Spine animation integration, working with backend, product, design and QA through Git and Jira.",
        "Đóng góp tính năng mobile bằng Flutter và tích hợp Spine animation, phối hợp với backend, product, design và QA qua Git và Jira.",
      ),
    ],
    stack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "WebSocket", "Flutter"],
  },
  {
    id: "freelance",
    company: "Freelance",
    title: t("Full-stack developer", "Full-stack developer"),
    start: "2023-01",
    end: null,
    location: t("Remote", "Từ xa"),
    summary: t(
      "Project-based client work running alongside my full-time role: I take the requirement, pick the stack it actually needs, and deliver it.",
      "Việc theo dự án cho khách, chạy song song với công việc chính: tôi nhận yêu cầu, chọn stack mà bài toán thực sự cần, rồi bàn giao.",
    ),
    work: [
      t(
        "Develop and maintain project-based web applications with React/Next.js, Node.js/NestJS, Laravel/PHP, C#, Payload CMS and WordPress (Flatsome).",
        "Phát triển và bảo trì ứng dụng web theo dự án bằng React/Next.js, Node.js/NestJS, Laravel/PHP, C#, Payload CMS và WordPress (Flatsome).",
      ),
      t(
        "Build responsive frontend interfaces, REST APIs, database-driven features and third-party integrations.",
        "Dựng giao diện responsive, REST API, tính năng dựa trên database và tích hợp dịch vụ bên thứ ba.",
      ),
      t(
        "Work directly with clients: analyse the requirement, estimate scope, troubleshoot, and hand over features that are ready for production.",
        "Làm việc trực tiếp với khách: phân tích yêu cầu, ước lượng phạm vi, xử lý sự cố và bàn giao tính năng dùng được thật.",
      ),
      t(
        "Apply technical SEO and performance practice: semantic HTML, structured data, metadata, image optimisation, lazy loading, caching and Core Web Vitals.",
        "Áp dụng SEO kỹ thuật và tối ưu hiệu năng: HTML ngữ nghĩa, dữ liệu có cấu trúc, metadata, tối ưu ảnh, lazy loading, caching và Core Web Vitals.",
      ),
    ],
    stack: ["React", "Next.js", "Node.js", "NestJS", "Laravel", "C#", "WordPress", "Payload CMS", "Technical SEO"],
  },
];

/* ------------------------------------------------------------------ *
 * The expertise map. `depth` drives how dense and how bright a        *
 * segment is drawn — it is a claim about breadth and confidence, not  *
 * a percentage, and it is never printed as a number.                  *
 * ------------------------------------------------------------------ */

export type Domain = {
  id: string;
  label: L;
  /** Ring label. Short by necessity — a long one collides with its neighbour. */
  short: string;
  aside: L;
  depth: 1 | 2 | 3 | 4 | 5;
  items: string[];
};

export const domains: Domain[] = [
  {
    id: "frontend",
    short: "Frontend",
    label: t("Frontend", "Frontend"),
    aside: t("Interface and interaction", "Giao diện và tương tác"),
    depth: 5,
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "Tailwind CSS",
      "SCSS",
      "Bootstrap",
      "SWR",
      "Vite",
      "Angular (basic)",
      "Responsive UI",
      "State management",
      "API integration",
      "Performance optimisation",
    ],
  },
  {
    id: "backend",
    short: "Backend",
    label: t("Backend", "Backend"),
    aside: t("Services and system design", "Dịch vụ và thiết kế hệ thống"),
    depth: 5,
    items: [
      "Node.js",
      "NestJS",
      "Express.js",
      "Laravel / PHP",
      "C#",
      "RESTful APIs",
      "WebSocket",
      "Webhooks",
      "BullMQ",
      "Background jobs",
      "System design",
    ],
  },
  {
    id: "ai",
    short: "AI",
    label: t("AI / Automation", "AI / Tự động hoá"),
    aside: t("Models in production workflows", "Đưa mô hình vào quy trình thật"),
    depth: 4,
    items: [
      "OpenAI API",
      "Whisper",
      "LLM integration",
      "Prompt engineering",
      "RAG concepts",
      "Python (AI testing)",
      "n8n",
      "AI Coding Assistants",
      "Automation pipelines",
    ],
  },
  {
    id: "testing",
    short: "Testing",
    label: t("Testing", "Kiểm thử"),
    aside: t("Proof before release", "Bằng chứng trước khi phát hành"),
    depth: 4,
    items: [
      "Playwright",
      "End-to-end testing",
      "API & integration testing",
      "AI output testing",
      "Core Web Vitals",
    ],
  },
  {
    id: "database",
    short: "Data",
    label: t("Database", "Cơ sở dữ liệu"),
    aside: t("Data stores & caching", "Lưu trữ dữ liệu & caching"),
    depth: 4,
    items: ["PostgreSQL", "MongoDB (Mongoose)", "MySQL", "Redis", "Query design", "Caching"],
  },
  {
    id: "devops",
    short: "DevOps",
    label: t("DevOps / Infrastructure", "DevOps / Hạ tầng"),
    aside: t("Deployment & delivery", "Triển khai & phân phối"),
    depth: 3,
    items: [
      "Docker",
      "Nginx",
      "Cloudflare",
      "Ubuntu VPS",
      "Jenkins CI/CD",
      "Deployment",
      "Environment config",
    ],
  },
  {
    id: "mobile",
    short: "Mobile",
    label: t("Mobile & CMS", "Mobile & CMS"),
    aside: t("Cross-platform & content", "Ứng dụng đa nền tảng & CMS"),
    depth: 3,
    items: ["React Native", "Flutter", "Payload CMS", "WordPress (Flatsome)", "Spine animation"],
  },
  {
    id: "game",
    short: "Games",
    label: t("Games", "Game"),
    aside: t("Loops, state and animation", "Vòng lặp, trạng thái và animation"),
    depth: 2,
    items: ["Flame engine", "Spine animation", "BLoC state", "2D RPG systems", "Game balancing"],
  },
  {
    id: "tools",
    short: "Tools",
    label: t("Tools / Workflow", "Công cụ / Quy trình"),
    aside: t("Development & collaboration", "Quy trình & phối hợp"),
    depth: 4,
    items: [
      "Git",
      "GitHub",
      "npm / yarn",
      "Vite",
      "Webpack",
      "Jira",
      "Trello",
      "Notion",
      "Figma",
      "Postman",
      "Agile / Scrum",
    ],
  },
];

/* ------------------------------------------------------------------ */

export const education = {
  school: "Saigon Technology University",
  program: t("Information Technology", "Công nghệ thông tin"),
};

export const languages = [
  { name: t("Vietnamese", "Tiếng Việt"), level: t("Native", "Bản ngữ") },
  { name: t("English", "Tiếng Anh"), level: t("TOEIC 550", "TOEIC 550") },
];

export const resumes = [
  { label: t("Full-stack CV", "CV Full-stack"), file: "/cv/TruongVinhThanh-FullStack.pdf" },
  { label: t("Frontend CV", "CV Frontend"), file: "/cv/TruongVinhThanh-Frontend.pdf" },
];
