"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

import { signupSchema, type SignupFormData } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export function SignupForm() {
  const t = useTranslations("Auth.signup");

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      userType: undefined,
      acceptTerms: false,
    },
  });

  function onSubmit(data: SignupFormData) {
    // TODO: Implement actual signup logic
    console.log("Signup submitted:", data);
  }

  return (
    <AuthCard className="max-w-lg">
      <AuthCardHeader>
        <AuthCardTitle>{t("title")}</AuthCardTitle>
        <AuthCardDescription>{t("subtitle")}</AuthCardDescription>
      </AuthCardHeader>

      <AuthCardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80">
                    {t("fullName")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t("fullNamePlaceholder")}
                      className="h-10 bg-background/50 border-white/10 focus:border-primary focus-visible:ring-primary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">
                      {t("phone")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder={t("phonePlaceholder")}
                        className="h-10 bg-background/50 border-white/10 focus:border-primary focus-visible:ring-primary/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80">
                    {t("userType")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10 bg-background/50 border-white/10 focus:border-primary focus:ring-primary/50">
                        <SelectValue placeholder={t("userTypePlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="individual">
                        {t("userTypes.individual")}
                      </SelectItem>
                      <SelectItem value="company">
                        {t("userTypes.company")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">
                      {t("password")}
                    </FormLabel>
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">
                      {t("confirmPassword")}
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder={t("confirmPasswordPlaceholder")}
                        className="border-white/10 focus:border-primary focus-visible:ring-primary/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="acceptTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-muted-foreground font-normal cursor-pointer">
                      {t("acceptTerms")}{" "}
                      <Link
                        href="/terms"
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        {t("termsOfService")}
                      </Link>{" "}
                      {t("and")}{" "}
                      <Link
                        href="/privacy"
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        {t("privacyPolicy")}
                      </Link>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-11 bg-primary text-black hover:bg-primary/90 rounded-none font-medium transition-all duration-300 btn-glow mt-2"
            >
              {t("submit")}
            </Button>
          </form>
        </Form>
      </AuthCardContent>

      <AuthCardFooter>
        <span>{t("hasAccount")} </span>
        <Link
          href="/login"
          className="text-primary hover:text-primary/80 transition-colors font-medium"
        >
          {t("signIn")}
        </Link>
      </AuthCardFooter>
    </AuthCard>
  );
}
