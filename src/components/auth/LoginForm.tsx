"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AuthCard,
  AuthCardHeader,
  AuthCardTitle,
  AuthCardDescription,
  AuthCardContent,
  AuthCardFooter,
} from "@/components/auth/AuthCard";
import { PasswordInput } from "@/components/auth/PasswordInput";

export function LoginForm() {
  const t = useTranslations("Auth.login");

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: LoginFormData) {
    // TODO: Implement actual login logic
    console.log("Login submitted:", data);
  }

  return (
    <AuthCard>
      <AuthCardHeader>
        <AuthCardTitle>{t("title")}</AuthCardTitle>
        <AuthCardDescription>{t("subtitle")}</AuthCardDescription>
      </AuthCardHeader>

      <AuthCardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80">
                    {t("email")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      className="h-10 bg-background/50 border-white/10 focus:border-primary focus-visible:ring-primary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-foreground/80">
                      {t("password")}
                    </FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      {t("forgotPassword")}
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput
                      placeholder={t("passwordPlaceholder")}
                      className="border-white/10 focus:border-primary focus-visible:ring-primary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-11 bg-primary text-black hover:bg-primary/90 rounded-none font-medium transition-all duration-300 btn-glow"
            >
              {t("submit")}
            </Button>
          </form>
        </Form>
      </AuthCardContent>

      <AuthCardFooter>
        <span>{t("noAccount")} </span>
        <Link
          href="/signup"
          className="text-primary hover:text-primary/80 transition-colors font-medium"
        >
          {t("signUp")}
        </Link>
      </AuthCardFooter>
    </AuthCard>
  );
}
