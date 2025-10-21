import axios from "axios";
import { getToken } from "../../design/utils/user";
import { useQuery } from "@tanstack/react-query";
import type { TypeUser } from "../../design/types/user";
import type { TypeTemplate } from "../../design/types/template";
import type { TypeDraft } from "@/design/types/draft";
import type { TypeAttachment } from "@/design/types/attachment";
import type { TypePortfolio } from "@/design/types/portfolio";

const auth = getToken();
if (auth) axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;

export function useVerfyEmail(token: string) {
  return useQuery({
    queryKey: ["verify-email", token],
    queryFn: async () => {
      const res = await axios.post("/auth/verify-email", { token });
      return res.data;
    },
    enabled: !!token,
    retry: false,
  });
}

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axios.get("/auth/me");
      return res.data as { user?: TypeUser };
    },
    retry: false,
  });
}

export function useTemplate(template: string) {
  return useQuery({
    queryKey: ["template", template],
    queryFn: async () => {
      if (!template) return null;
      const res = await axios.get("/templates/" + template);
      return res.data.data;
    },
  });
}

export function useTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const res = await axios.get("/templates");
      return res.data as { templates: TypeTemplate[] };
    },
    retry: false,
  });
}

export function usePortfolios() {
  return useQuery({
    queryKey: ["portfolios"],
    queryFn: async () => {
      const res = await axios.get("/portfolios");
      return res.data as TypePortfolio[];
    },
  });
}

export function usePortfolio(id: string, isEnabled: boolean = true) {
  return useQuery({
    queryKey: ["portfolio", id],
    queryFn: async () => {
      const res = await axios.get("/portfolios/" + id);
      return res.data;
    },
    enabled: isEnabled,
  });
}

export function usePortfolioDraft(id: string) {
  return useQuery({
    queryKey: ["portfolio", id, "draft"],
    queryFn: async () => {
      const res = await axios.get("/portfolios/" + id + "/draft");
      return res.data as TypeDraft;
    },
  });
}

export function GetAttachments(id: string) {
  return useQuery({
    queryKey: ["attachments", id],
    queryFn: async () => {
      const res = await axios.get("/portfolios/" + id + "/attachments");
      return res.data as TypeAttachment[];
    },
  });
}

export function GetPortfolioState(id: string, isEnabled: boolean = false) {
  return useQuery({
    queryKey: ["portfolio", id, "state"],
    queryFn: async () => {
      const res = await axios.get("/portfolios/" + id + "/state");
      return res.data as { status: string | "active" };
    },
    enabled: isEnabled,
    refetchInterval: 15000,
  });
}

export function GetPortfolioAnalytics(
  id: string,
  from: string,
  to: string,
  isEnabled: boolean
) {
  return useQuery({
    queryKey: ["portfolio", id, "analytics", from, to],
    queryFn: async () => {
      const res = await axios.get(
        "/portfolios/" + id + "/analytics?from=" + from + "&to=" + to
      );

      return res.data as {
        totalViews: number;
        totalUnique: number;
        daily: {
          date: string;
          views: number;
          unique: number;
        }[];
      };
    },
    enabled: isEnabled,
  });
}

export function useValidateResetKey(key: string) {
  return useQuery({
    queryKey: ["reset-key-validation", key],
    queryFn: async () => {
      const res = await axios.get("/auth/reset-password?token=" + key);
      return res.data as { valid: boolean };
    },
  });
}

export function GetPortfolioEventAnalytics(
  id: string,
  event: string,
  from: string,
  to: string,
  isEnabled: boolean
) {
  return useQuery({
    queryKey: ["portfolio", id, "event", "analytics", from, to],
    queryFn: async () => {
      const res = await axios.get(
        "/portfolios/" +
          id +
          "/event-analytics?event=" +
          event +
          "&from=" +
          from +
          "&to=" +
          to
      );
      return res.data as {
        key: string;
        url: string;
        name: string;
        count: number;
      }[];
    },
    enabled: isEnabled,
  });
}
