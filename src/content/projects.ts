import { t, type L } from "@/lib/i18n";

/**
 * Real repositories from github.com/tvinhthanh, with the descriptions written
 * for the profile README. Nothing here is invented — `updated` and `stars`
 * are the values GitHub reported when this page was last built.
 */

export type Category = "business" | "commerce" | "ai" | "mobile" | "game" | "frontend";

export type Project = {
  id: string;
  repo: string | null;
  name: L;
  summary: L;
  built: string[];
  category: Category;
  language: string | null;
  stars: number;
  updated: string;
  featured?: boolean;
  note?: L;
};

export const categories: { id: Category | "all"; label: L }[] = [
  { id: "all", label: t("All", "Tất cả") },
  { id: "business", label: t("Business systems", "Hệ thống nghiệp vụ") },
  { id: "commerce", label: t("Commerce", "Thương mại") },
  { id: "ai", label: t("AI & tooling", "AI & công cụ") },
  { id: "mobile", label: t("Mobile", "Mobile") },
  { id: "game", label: t("Games", "Game") },
  { id: "frontend", label: t("Web & frontend", "Web & frontend") },
];

export const projects: Project[] = [
  {
    id: "pvt-space",
    repo: null,
    name: t("pvt.space", "pvt.space"),
    summary: t(
      "Creator monetisation and membership platform. Tiered subscriptions, one-to-one calls, message channels, in-app AI features, real-time perks over WebSocket, and a content pipeline that ships the surface in 28 locales without a translator in the loop.",
      "Nền tảng creator monetisation và membership. Đăng ký nhiều bậc, gọi 1-1, kênh nhắn tin, tính năng AI trong app, quyền lợi thời gian thực qua WebSocket, và pipeline nội dung đưa giao diện chạy 28 ngôn ngữ mà không cần dịch giả trong quy trình.",
    ),
    built: ["Next.js", "NestJS", "MongoDB", "Redis", "WebSocket", "WebRTC", "OpenAI"],
    category: "business",
    language: null,
    stars: 0,
    updated: "2026-08-24",
    featured: true,
    note: t(
      "Client project — the source is private. This entry describes the scope and my role only.",
      "Dự án khách hàng — mã nguồn riêng tư. Mục này chỉ mô tả phạm vi và vai trò của tôi.",
    ),
  },
  {
    id: "social-platform-case-study",
    repo: "social-platform-case-study",
    name: t("Social platform — web client & CMS", "Nền tảng mạng xã hội — web client & CMS"),
    summary: t(
      "A production, mobile-first social platform shipped on iOS, Android and web: live audio rooms, an embedded 2D game, a creator marketplace built on 3D assets, and a referral programme. Four repositories, around 590 commits, seven contributors.",
      "Một nền tảng mạng xã hội chạy thật, ưu tiên mobile, phát hành trên iOS, Android và web: phòng audio trực tiếp, game 2D nhúng, chợ creator dựng trên tài nguyên 3D và chương trình giới thiệu. Bốn repository, khoảng 590 commit, bảy người đóng góp.",
    ),
    built: [
      "Next.js 16",
      "React 19",
      "Payload CMS",
      "React Three Fiber",
      "NextAuth v5",
      "BFF proxy",
      "Transactional outbox",
    ],
    category: "business",
    language: null,
    stars: 0,
    updated: "2026-08-24",
    featured: true,
    note: t(
      "The client owns the source. The public repository documents the architecture and exactly which parts were mine — no code.",
      "Khách hàng giữ mã nguồn. Repository công khai chỉ ghi lại kiến trúc và đúng phần việc của tôi — không có code.",
    ),
  },
  {
    id: "rental-lv",
    repo: "rental-lv",
    name: t("Vehicle rental platform", "Nền tảng cho thuê xe"),
    summary: t(
      "Multi-tenant vehicle rental, end to end: booking → contract → deposit → handover → return → invoice → surcharge, with fleet documents, layered pricing and loyalty on top.",
      "Cho thuê xe đa chi nhánh, trọn vòng đời: đặt xe → hợp đồng → cọc → giao xe → nhận xe → hoá đơn → phụ phí, kèm hồ sơ đội xe, bảng giá nhiều tầng và loyalty.",
    ),
    built: ["NestJS", "Prisma", "MongoDB", "Next.js App Router", "pnpm monorepo"],
    category: "business",
    language: "TypeScript",
    stars: 2,
    updated: "2026-08-24",
    featured: true,
  },
  {
    id: "cms-pos",
    repo: "cms-pos",
    name: t("Point of sale", "Hệ thống bán hàng tại quầy"),
    summary: t(
      "POS and simplified accounting for small F&B shops. Recipe-based COGS with weighted-average costing, shift reconciliation, live kitchen display.",
      "POS và kế toán rút gọn cho quán F&B nhỏ. Giá vốn theo công thức với bình quân gia quyền, đối soát ca, màn hình bếp cập nhật trực tiếp.",
    ),
    built: ["FastAPI", "Celery", "Redis", "WebSocket", "Next.js", "Docker"],
    category: "business",
    language: "TypeScript",
    stars: 0,
    updated: "2026-08-24",
    featured: true,
  },
  {
    id: "trangsuc",
    repo: "trangsuc",
    name: t("Jewellery, three markets", "Trang sức, ba thị trường"),
    summary: t(
      "Jewellery storefront for three markets. Live multi-currency pricing, 3D product inspection, and a server-side proxy so the browser never holds a credential.",
      "Cửa hàng trang sức cho ba thị trường. Giá đa tiền tệ cập nhật trực tiếp, xem sản phẩm 3D, và proxy phía server để trình duyệt không bao giờ giữ credential.",
    ),
    built: ["Next.js 16", "React 19", "React Compiler", "Tailwind v4", "Supabase", "model-viewer"],
    category: "commerce",
    language: "TypeScript",
    stars: 0,
    updated: "2026-08-24",
    featured: true,
  },
  {
    id: "WMS",
    repo: "WMS",
    name: t("Warehouse management", "Quản lý kho"),
    summary: t(
      "Warehouse operations with serial-level traceability — picking down to the individual unit, stock takes, and a damage workflow that requires approval.",
      "Vận hành kho truy vết tới từng serial — soạn hàng xuống từng đơn vị, kiểm kê, và luồng xử lý hàng hỏng bắt buộc có duyệt.",
    ),
    built: ["ASP.NET Core", "React", "TypeScript", "SQL Server"],
    category: "business",
    language: "TypeScript",
    stars: 1,
    updated: "2026-08-24",
    featured: true,
  },
  {
    id: "lv-be",
    repo: "lv-be",
    name: t("Phone store — API", "Cửa hàng điện thoại — API"),
    summary: t(
      "The commerce API behind a phone store: catalogue, variants, instalments, warranties and orders that keep a record of what was true when they were placed.",
      "API thương mại phía sau một cửa hàng điện thoại: danh mục, biến thể, trả góp, bảo hành và đơn hàng giữ lại đúng những gì đúng tại thời điểm đặt.",
    ),
    built: ["ASP.NET Core", "EF Core", "SQL Server"],
    category: "commerce",
    language: "C#",
    stars: 0,
    updated: "2026-08-24",
    featured: true,
  },
  {
    id: "lv-fe",
    repo: "lv-fe",
    name: t("Phone store — storefront", "Cửa hàng điện thoại — giao diện"),
    summary: t(
      "The storefront for the same product: templated specs, variant pricing, a payment-gateway callback flow and an AI chatbot with conversation memory.",
      "Giao diện của cùng sản phẩm: thông số theo template, giá theo biến thể, luồng callback cổng thanh toán và chatbot AI có nhớ hội thoại.",
    ),
    built: ["React 19", "Vite", "Tailwind CSS", "Quill"],
    category: "commerce",
    language: "JavaScript",
    stars: 0,
    updated: "2026-08-24",
  },
  {
    id: "luanvan2024",
    repo: "luanvan2024",
    name: t("Veterinary platform", "Nền tảng thú y"),
    summary: t(
      "Veterinary clinic platform — pets, medical records, medications, bookings, invoicing. Web back office plus a Flutter app for owners.",
      "Nền tảng phòng khám thú y — thú cưng, hồ sơ bệnh án, thuốc, đặt lịch, hoá đơn. Back office trên web kèm ứng dụng Flutter cho chủ nuôi.",
    ),
    built: ["Express", "TypeScript", "MongoDB", "React", "Flutter", "Stripe"],
    category: "business",
    language: "TypeScript",
    stars: 2,
    updated: "2026-08-24",
  },
  {
    id: "phone-case",
    repo: "phone-case",
    name: t("Accessory marketplace", "Chợ phụ kiện"),
    summary: t(
      "Multi-vendor accessory marketplace — each seller owns a store, with products, orders and reviews resolving through it.",
      "Chợ phụ kiện nhiều người bán — mỗi người bán sở hữu một gian hàng, sản phẩm, đơn hàng và đánh giá đều đi qua gian hàng đó.",
    ),
    built: ["React", "TypeScript", "Express", "MongoDB", "Cloudinary", "Stripe"],
    category: "commerce",
    language: "TypeScript",
    stars: 0,
    updated: "2026-08-24",
  },
  {
    id: "WareHouse-V2",
    repo: "WareHouse-V2",
    name: t("Warehouse V2", "Kho V2"),
    summary: t(
      "Second pass at the warehouse problem — networked stores and product diagrams, rebuilt in TypeScript.",
      "Lần làm lại bài toán kho — nhiều cửa hàng nối mạng và sơ đồ sản phẩm, viết lại bằng TypeScript.",
    ),
    built: ["TypeScript"],
    category: "business",
    language: "TypeScript",
    stars: 0,
    updated: "2026-08-28",
  },
  {
    id: "Jeweley_Web",
    repo: "Jeweley_Web",
    name: t("Jewellery, edge-rendered", "Trang sức, render tại edge"),
    summary: t(
      "Jewellery storefront rendered at the edge, with checkout success and failure as separate routes.",
      "Cửa hàng trang sức render tại edge, với route thành công và thất bại của thanh toán tách riêng.",
    ),
    built: ["Next.js 15", "React 19", "Cloudflare Pages"],
    category: "commerce",
    language: "TypeScript",
    stars: 0,
    updated: "2026-08-24",
  },
  {
    id: "shop",
    repo: "shop",
    name: t("General store", "Cửa hàng tổng hợp"),
    summary: t(
      "Store where an order and its delivery note are separate records, so what was ordered and what shipped can differ.",
      "Cửa hàng mà đơn hàng và phiếu giao là hai bản ghi tách rời, nên thứ đã đặt và thứ đã giao có thể khác nhau.",
    ),
    built: ["React", "Express", "MongoDB"],
    category: "commerce",
    language: "JavaScript",
    stars: 0,
    updated: "2026-08-24",
  },
  {
    id: "shoe_store",
    repo: "shoe_store",
    name: t("Shoe shop", "Cửa hàng giày"),
    summary: t(
      "Shoe shop, with the order-flow test scenarios written down before the flow was called done.",
      "Cửa hàng giày, với các kịch bản kiểm thử luồng đặt hàng được viết ra trước khi coi luồng đó là xong.",
    ),
    built: ["Express", "TypeScript", "React", "Vite"],
    category: "commerce",
    language: "TypeScript",
    stars: 0,
    updated: "2026-08-24",
  },
  {
    id: "book_store",
    repo: "book_store",
    name: t("Bookshop", "Hiệu sách"),
    summary: t(
      "Bookshop — catalogue, cart, orders.",
      "Hiệu sách — danh mục, giỏ hàng, đơn hàng.",
    ),
    built: ["Express", "TypeScript", "React"],
    category: "commerce",
    language: "TypeScript",
    stars: 0,
    updated: "2026-08-24",
  },
  {
    id: "shop_laravel",
    repo: "shop_laravel",
    name: t("One shop, three ways", "Một bài toán shop, ba cách giải"),
    summary: t(
      "The same shop problem solved three ways — with a framework, as hand-rolled OOP, and procedurally. Kept together on purpose: the comparison is the point.",
      "Cùng một bài toán shop giải theo ba cách — dùng framework, tự viết OOP, và viết thủ tục. Để cạnh nhau có chủ đích: so sánh mới là điểm chính.",
    ),
    built: ["Laravel", "Blade", "PHP OOP", "MySQL"],
    category: "commerce",
    language: "Blade",
    stars: 0,
    updated: "2026-08-24",
  },
  {
    id: "tu_tien_game",
    repo: "tu_tien_game",
    name: t("Cultivation RPG", "Game tu tiên"),
    summary: t(
      "2D cultivation RPG. Inventory state runs through BLoC rather than setState, and every balance value lives in one constants file.",
      "Game nhập vai tu tiên 2D. Trạng thái túi đồ chạy qua BLoC thay vì setState, và mọi chỉ số cân bằng nằm trong một file hằng số duy nhất.",
    ),
    built: ["Flutter", "Flame", "BLoC"],
    category: "game",
    language: "Dart",
    stars: 0,
    updated: "2026-08-24",
  },
  {
    id: "library_management_app",
    repo: "library_management_app",
    name: t("Library app", "Ứng dụng thư viện"),
    summary: t(
      "Library client — catalogue, borrowing, returns, with CI building the app on every push.",
      "Ứng dụng thư viện — danh mục, mượn, trả, kèm CI build app mỗi lần push.",
    ),
    built: ["Flutter", "Dart", "GitHub Actions"],
    category: "mobile",
    language: "Dart",
    stars: 3,
    updated: "2026-08-24",
  },
  {
    id: "flame_menu_4games",
    repo: "flame_menu_4games",
    name: t("Game menu & Spine study", "Menu game & nghiên cứu Spine"),
    summary: t(
      "Game menu shell, and a written study of how Spine skeletal animation behaves in Flutter compared with Unity.",
      "Khung menu game, kèm bài nghiên cứu về cách Spine skeletal animation chạy trên Flutter so với Unity.",
    ),
    built: ["Flutter", "Flame", "Spine"],
    category: "game",
    language: "Dart",
    stars: 0,
    updated: "2026-08-24",
  },
  {
    id: "animation_web",
    repo: "animation_web",
    name: t("Animation experiments", "Thí nghiệm animation"),
    summary: t(
      "Two animation experiments: a 3D rotation with no JavaScript at all, and a scroll-driven glTF scene.",
      "Hai thí nghiệm animation: một phép xoay 3D không dùng chút JavaScript nào, và một cảnh glTF điều khiển bằng scroll.",
    ),
    built: ["CSS", "Three.js"],
    category: "frontend",
    language: "HTML",
    stars: 0,
    updated: "2026-08-24",
  },
  {
    id: "MMO_Nexus_WEB",
    repo: "MMO_Nexus_WEB",
    name: t("Marketing site + dashboard", "Trang marketing + dashboard"),
    summary: t(
      "Marketing site with an authenticated dashboard behind it.",
      "Trang marketing kèm dashboard yêu cầu đăng nhập phía sau.",
    ),
    built: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    category: "frontend",
    language: "TypeScript",
    stars: 0,
    updated: "2026-08-24",
  },
  {
    id: "2FAS-MMO",
    repo: "2FAS-MMO",
    name: t("2FA landing page", "Landing page 2FA"),
    summary: t(
      "Landing page composed from isolated sections, so blocks can be reordered without touching each other.",
      "Landing page ghép từ các section độc lập, nên có thể đổi thứ tự khối mà không đụng vào nhau.",
    ),
    built: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    category: "frontend",
    language: "TypeScript",
    stars: 0,
    updated: "2026-08-24",
  },
  {
    id: "Lash-Studio-Site",
    repo: "Lash-Studio-Site",
    name: t("Lash studio booking", "Trang đặt lịch lash studio"),
    summary: t(
      "Booking site taken from a written brief to a working product.",
      "Trang đặt lịch đi từ một bản brief viết tay tới sản phẩm chạy được.",
    ),
    built: ["React", "Drizzle ORM"],
    category: "frontend",
    language: "TypeScript",
    stars: 0,
    updated: "2026-08-24",
  },
];


/* ------------------------------------------------------------------ *
 * Featured work. Written from the repository READMEs — role and scope *
 * describe what was built, and the numbers are the project's own.     *
 * ------------------------------------------------------------------ */

export type FeaturedDetail = {
  index: string;
  role: L;
  challenge: L;
  outcome: L;
  /** Only where the split of work needs stating precisely. */
  breakdown?: { surface: string; share: string; note: L }[];
};

export const featuredDetail: Record<string, FeaturedDetail> = {
  "pvt-space": {
    index: "01",
    role: t(
      "Owner of the one-to-one call flow, the message channels, the in-app AI features, the 28-locale content pipeline, membership perks in real time, and the SSR product surface.",
      "Chủ luồng gọi 1-1, kênh tin nhắn, các tính năng AI trong app, pipeline nội dung 28 ngôn ngữ, quyền lợi membership thời gian thực, và giao diện sản phẩm SSR.",
    ),
    challenge: t(
      "Real-time everything under one roof: peer-to-peer calls that reconnect through network changes, message channels with delivery guarantees, streaming AI features running next to human replies, and membership state that reaches subscribers without a re-render race — all on a surface that renders in 28 locales without a translator in the loop.",
      "Thời gian thực trong cùng một sản phẩm: cuộc gọi peer-to-peer tự nối lại khi đổi mạng, kênh tin nhắn có bảo đảm giao nhận, tính năng AI stream chạy cạnh trả lời của người thật, và trạng thái membership tới subscriber không kẹt vòng render — tất cả trên một giao diện chạy được 28 locale mà không cần dịch giả trong quy trình.",
    ),
    outcome: t(
      "One-to-one call flow over WebRTC, message channels backed by a Redis fan-out, streaming AI features inside the shell, membership perks pushed over WebSocket, and a 28-locale content pipeline driven by OpenAI translation.",
      "Luồng gọi 1-1 qua WebRTC, kênh nhắn tin dựa trên Redis fan-out, tính năng AI stream ngay trong shell, quyền lợi membership đẩy qua WebSocket, và pipeline nội dung 28 locale do OpenAI dịch nền.",
    ),
    breakdown: [
      {
        surface: "1-to-1 call (WebRTC)",
        share: "Owner",
        note: t("Signalling, ICE, reconnect", "Signalling, ICE, tự nối lại"),
      },
      {
        surface: "Message channels",
        share: "Owner",
        note: t("Fan-out, delivery, presence", "Fan-out, giao nhận, presence"),
      },
      {
        surface: "In-app AI features",
        share: "Owner",
        note: t("Streaming, prompt orchestration", "Streaming, điều phối prompt"),
      },
      {
        surface: "Content pipeline (28 locales)",
        share: "Owner",
        note: t("Background OpenAI translation", "Dịch nền qua OpenAI"),
      },
      {
        surface: "Membership perks (realtime)",
        share: "Owner",
        note: t("WebSocket, entitlement checks", "WebSocket, kiểm quyền"),
      },
      {
        surface: "SSR product surface",
        share: "Owner",
        note: t("Next.js App Router", "Next.js App Router"),
      },
    ],
  },
  "rental-lv": {
    index: "03",
    role: t(
      "Full-stack — schema, API and three role-scoped interfaces",
      "Full-stack — schema, API và ba giao diện theo vai trò",
    ),
    challenge: t(
      "Booking through to invoice is one long transaction with money attached at every step. Handover and return are two separately dated condition records, so a dispute about a scratch has an answer rather than an argument.",
      "Từ lúc đặt xe tới khi xuất hoá đơn là một transaction dài, bước nào cũng dính tới tiền. Giao xe và nhận xe là hai bản ghi tình trạng có ngày riêng, nên tranh chấp về một vết xước có câu trả lời chứ không phải cuộc cãi vã.",
    ),
    outcome: t(
      "38 backend modules, 39 data models, layered pricing, loyalty and SEO content in one pnpm monorepo.",
      "38 module backend, 39 model dữ liệu, bảng giá nhiều tầng, loyalty và nội dung SEO trong một pnpm monorepo.",
    ),
  },
  "cms-pos": {
    index: "04",
    role: t(
      "Full-stack — Python services and the Next.js back office",
      "Full-stack — service Python và back office Next.js",
    ),
    challenge: t(
      "Recipe-based cost of goods with weighted-average costing, on a cashbook that rejects UPDATE and DELETE — so changing a recipe next month cannot rewrite last month's profit.",
      "Giá vốn theo công thức với bình quân gia quyền, trên một sổ quỹ từ chối UPDATE và DELETE — nên tháng sau sửa công thức cũng không viết lại được lợi nhuận tháng trước.",
    ),
    outcome: t(
      "Shift reconciliation, background costing through Celery and Redis, and a kitchen display that updates over WebSocket.",
      "Đối soát ca, tính giá vốn nền bằng Celery và Redis, và màn hình bếp cập nhật qua WebSocket.",
    ),
  },
  trangsuc: {
    index: "05",
    role: t("Frontend and backend-for-frontend", "Frontend và lớp backend-for-frontend"),
    challenge: t(
      "One storefront serving three markets: live multi-currency pricing and 3D product inspection, with every credential kept behind a server-side proxy so the browser never holds one.",
      "Một cửa hàng phục vụ ba thị trường: giá đa tiền tệ cập nhật trực tiếp và xem sản phẩm 3D, mọi credential nằm sau proxy phía server để trình duyệt không bao giờ giữ.",
    ),
    outcome: t(
      "Next.js 16 and React 19 with the React Compiler, on Supabase.",
      "Next.js 16 và React 19 với React Compiler, chạy trên Supabase.",
    ),
  },
  WMS: {
    index: "06",
    role: t("Full-stack — .NET API and React client", "Full-stack — API .NET và client React"),
    challenge: t(
      "Traceability down to the individual serial. InventoryLog is the source of truth and the stock figure is derived from it, so a stock take records the difference instead of overwriting the number.",
      "Truy vết xuống tới từng serial. InventoryLog là nguồn sự thật còn con số tồn được suy ra từ đó, nên kiểm kê ghi lại phần chênh lệch thay vì ghi đè con số.",
    ),
    outcome: t(
      "Picking, stock takes and a damage workflow gated behind approval.",
      "Soạn hàng, kiểm kê và luồng xử lý hàng hỏng bắt buộc qua duyệt.",
    ),
  },
  "social-platform-case-study": {
    index: "02",
    role: t(
      "Sole author of the web client and the headless CMS; contributor on the Flutter app and the NestJS API.",
      "Tự làm toàn bộ web client và headless CMS; tham gia đóng góp cho app Flutter và API NestJS.",
    ),
    challenge: t(
      "Referral money had to be defensible. Instead of a counter and a mutable balance, attribution runs as a pipeline — links, clicks, attributions, ledger entries — and creator balances are a cache recomputed from the ledger. Event publishing goes through a transactional outbox, so a crash between writing state and announcing it leaves an unrelayed row rather than two systems that quietly disagree forever.",
      "Tiền giới thiệu phải bảo vệ được. Thay vì một bộ đếm và số dư sửa được, phần ghi nhận chạy như một pipeline — link, click, attribution, bút toán sổ cái — còn số dư creator chỉ là cache tính lại từ sổ. Việc phát sự kiện đi qua transactional outbox, nên nếu sập giữa lúc ghi trạng thái và lúc thông báo thì chỉ còn một dòng chưa gửi, chứ không phải hai hệ thống lệch nhau vĩnh viễn.",
    ),
    outcome: t(
      "A 3D asset pipeline where one model carries variants and placed instances without duplication; three route groups serving three genuinely different shells; and a catch-all BFF proxy so the browser never learns the upstream origin or holds a service credential.",
      "Một pipeline tài nguyên 3D nơi một model mang nhiều biến thể và bản đặt vào mà không nhân bản; ba route group phục vụ ba lớp vỏ thật sự khác nhau; và một BFF proxy catch-all để trình duyệt không bao giờ biết origin thượng nguồn hay giữ credential dịch vụ.",
    ),
    breakdown: [
      {
        surface: "Web client (Next.js)",
        share: "115 / 115",
        note: t("Sole author", "Tự làm toàn bộ"),
      },
      {
        surface: "Headless CMS (Payload)",
        share: "69 / 69",
        note: t("Sole author", "Tự làm toàn bộ"),
      },
      {
        surface: "Mobile app (Flutter)",
        share: "46 / 232",
        note: t("Contributor", "Đóng góp"),
      },
      {
        surface: "Backend (NestJS)",
        share: "18 / 155",
        note: t("Contributor", "Đóng góp"),
      },
    ],
  },
  "lv-be": {
    index: "07",
    role: t("Backend — ASP.NET Core and EF Core", "Backend — ASP.NET Core và EF Core"),
    challenge: t(
      "Specs are templated per category, so adding a whole product category needs no migration. Variants are priced individually and orders snapshot what was true at checkout.",
      "Thông số được template theo danh mục, nên thêm hẳn một danh mục sản phẩm cũng không cần migration. Biến thể có giá riêng và đơn hàng chụp lại đúng những gì đúng tại thời điểm đặt.",
    ),
    outcome: t(
      "0% instalment plans, warranty tiers, and a React 19 storefront on the same contract.",
      "Trả góp 0%, gói bảo hành, và một storefront React 19 dùng chung hợp đồng API.",
    ),
  },
};

export const featured = projects.filter((p) => p.featured);
export const archive = projects.filter((p) => !p.featured);
