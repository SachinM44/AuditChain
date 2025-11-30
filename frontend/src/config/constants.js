export const NETWORK = "testnet";
export const MODULE_ADDRESS = "0x65ae7329234cdb84e5b0356d6b26e77b8ceac8e90f3d487f4326580349844018";

export const PACKAGE_REGISTRY_MODULE = `${MODULE_ADDRESS}::PackageRegistry`;
export const FINDING_REGISTRY_MODULE = `${MODULE_ADDRESS}::FindingRegistry`;

export const REGISTRATION_FEES = {
  BASIC: 10_00000000, // 10 APT
  POPULAR: 25_00000000, // 25 APT
  ENTERPRISE: 50_00000000 // 50 APT
};

export const SEVERITY_LABELS = {
  0: "LOW",
  1: "MEDIUM",
  2: "HIGH",
  3: "CRITICAL"
};

export const STATUS_LABELS = {
  0: "PENDING",
  1: "ACCEPTED",
  2: "REJECTED"
};
