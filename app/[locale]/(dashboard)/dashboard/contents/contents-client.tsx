"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteContentTable } from "./contents-table";
import { useTranslations } from "next-intl";

export function SiteContentsClient() {
    const t = useTranslations("Dashboard.Contents");
    const [activeTab, setActiveTab] = useState<"BANNER" | "SOCIAL_LINK" | "PARTNER">("BANNER");

    return (
        <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="BANNER">{t("banners") || "Banners"}</TabsTrigger>
                    <TabsTrigger value="SOCIAL_LINK">{t("socialLinks") || "Social Links"}</TabsTrigger>
                    <TabsTrigger value="PARTNER">{t("partners") || "Partners"}</TabsTrigger>
                </TabsList>
                <TabsContent value="BANNER" className="mt-6">
                    <SiteContentTable type="BANNER" />
                </TabsContent>
                <TabsContent value="SOCIAL_LINK" className="mt-6">
                    <SiteContentTable type="SOCIAL_LINK" />
                </TabsContent>
                <TabsContent value="PARTNER" className="mt-6">
                    <SiteContentTable type="PARTNER" />
                </TabsContent>
            </Tabs>
        </div>
    );
}
