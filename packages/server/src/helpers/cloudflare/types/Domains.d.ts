export type Domain = {
  id: string;
  certificate_authority: string;
  created_on: string;
  domain_id: string;
  name: string;
  status: "initializing";
  validation_data: {
    error_message: string;
    method: "http";
    status: "initializing";
    txt_name: string;
    txt_value: string;
  };
  verification_data: {
    error_message: string;
    status: "pending";
  };
  zone_tag: string;
};
