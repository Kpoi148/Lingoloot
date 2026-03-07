// Source module for the constants feature.
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
    { label: "Quản lý từ vựng", href: "/admin/vocabulary-management", icon: BookOpen },
    { label: "Quản lý chủ đề", href: "/admin/category-management", icon: Layers },
    { label: "Quản lý bài tập Quiz", href: "/admin/quiz-management", icon: ListChecks },
    { label: "Quản lý người dùng", href: "/admin/user-management", icon: Users },
    { label: "Cửa hàng", href: "/admin/shop-management", icon: ShoppingBag },
];
