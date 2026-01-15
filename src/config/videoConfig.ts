export interface VideoConfig {
  videoId: string;
  title: string;
  description: string;
}

export const videoConfigs: Record<string, VideoConfig> = {
  "Personal Protective Equipment (PPE)": {
    videoId: "N-wMw5c8s80", // Standard PPE video
    title: "Understanding Personal Protective Equipment",
    description: "Learn about the essential PPE required for warehouse operations, including high-visibility vests, safety shoes, and helmets."
  },
  "Pre-Operation Inspection": {
    videoId: "m2b0V5y1_6E", // Pre-start Check Video (Generic)
    title: "Vehicle and Equipment Inspection",
    description: "A step-by-step guide to performing pre-operation inspections on forklifts and pallet jacks."
  },
  "Safe Loading Procedures": {
    videoId: "0n3k9k7k-00", // Safe Loading (Generic placeholder)
    title: "Safe Truck Loading Techniques",
    description: "Best practices for loading trucks safely to prevent shifting loads and ensure weight distribution."
  },
  "Safe Unloading Procedures": {
    videoId: "f-7k8k9k-11", // Safe Unloading (Generic placeholder)
    title: "Unloading Safety Protocols",
    description: "Critical safety measures to follow when unloading goods from delivery vehicles."
  },
  "Emergency Protocols": {
    videoId: "e-1k2k3k-22",
    title: "Emergency Response in the Warehouse",
    description: "What to do in case of accidents, spills, or fire emergencies."
  },
  "Hazard Identification": {
    videoId: "h-3k4k5k-33",
    title: "Spotting Warehouse Hazards",
    description: "How to identify and report potential safety hazards before they cause accidents."
  },
  "Documentation & Reporting": {
    videoId: "d-4k5k6k-44",
    title: "Proper Documentation",
    description: "The importance of maintaining accurate logs and incident reports."
  }
};
