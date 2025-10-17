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

export function usePortfolio(id: string) {
  return useQuery({
    queryKey: ["portfolio", id],
    queryFn: async () => {
      const res = await axios.get("/portfolios/" + id);
      return res.data;
    },
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
