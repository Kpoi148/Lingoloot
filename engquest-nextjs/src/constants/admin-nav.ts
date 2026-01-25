import {
    BookOpen,
    LayoutDashboard,
    ListChecks,
    Layers,
    Users,
    ShoppingBag,
} from "lucide-react";

export const adminNavItems = [
    { label: "Tổng quan", href: "/admin", icon: LayoutDashboard },
    { label: "Quản lý từ vựng", href: "/admin/vocabularies", icon: BookOpen },
    { label: "Quản lý chủ đề", href: "/admin/categories", icon: Layers },
    { label: "Quản lý bài tập Quiz", href: "/admin/quizzes", icon: ListChecks },
    { label: "Quản lý người dùng", href: "/admin/users", icon: Users },
    { label: "Cửa hàng", href: "/admin/shop", icon: ShoppingBag },
];
