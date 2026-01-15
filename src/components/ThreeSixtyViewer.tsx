import { useEffect, useRef, useState } from "react";
import { X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    pannellum: any;
  }
}

interface Hotspot {
  pitch: number;
  yaw: number;
  cssClass?: string; // We'll handle this internally mostly, but allow override
  createTooltipArgs: {
    title: string;
    text: string;
  };
}

interface ThreeSixtyViewerProps {
  imageUrl: string;
  hotspots?: Hotspot[];
  autoLoad?: boolean;
}

export default function ThreeSixtyViewer({
  imageUrl,
  hotspots = [],
  autoLoad = true,
}: ThreeSixtyViewerProps) {
  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<any>(null);

  // Info panel state
  const [showInfo, setShowInfo] = useState(false);
  const [infoContent, setInfoContent] = useState({ title: "", text: "" });

  useEffect(() => {
    if (!viewerContainerRef.current || !window.pannellum) return;

    // Destroy existing instance if any
    if (viewerInstanceRef.current) {
      // Pannellum doesn't have a destroy method on the viewer instance directly documented well,
      // but re-initializing on the same ID usually works or we can empty the div.
      // However, pannellum.viewer returns the viewer object.
      // The best way to cleanup is often to clear the container innerHTML if destroy isn't available
      // BUT pannellum usually attaches to the ID.
    }

    // Clear container just in case
    viewerContainerRef.current.innerHTML = "";

    const hotspotFunc = (
      hotSpotDiv: HTMLElement,
      args: { title: string; text: string }
    ) => {
      hotSpotDiv.classList.add("custom-tooltip-hotspot");
      const icon = document.createElement("div");
      icon.style.width = "100%";
      icon.style.height = "100%";
      // icon.style.background = 'rgba(255, 0, 0, 0.7)';
      // icon.style.borderRadius = '50%';
      // icon.style.border = '2px solid white';

      hotSpotDiv.appendChild(icon);

      hotSpotDiv.addEventListener("click", () => {
        setInfoContent(args);
        setShowInfo(true);
      });
    };

    const processedHotspots = hotspots.map((h) => ({
      ...h,
      cssClass: "custom-hotspot", // We will define this global style or use inline styles via JS if needed
      createTooltipFunc: hotspotFunc,
      createTooltipArgs: h.createTooltipArgs,
    }));

    // Initialize viewer
    // We need a unique ID for the container if we have multiple, but here we likely have one.
    // Using the ref to set the ID dynamically could be safer but 'panorama' is standard.
    viewerContainerRef.current.id =
      "panorama-container-" + Math.random().toString(36).substr(2, 9);

    viewerInstanceRef.current = window.pannellum.viewer(
      viewerContainerRef.current.id,
      {
        type: "equirectangular",
        panorama: imageUrl,
        autoLoad: autoLoad,
        showControls: true,
        hotSpots: processedHotspots,
      }
    );

    // Cleanup
    return () => {
      // if (viewerInstanceRef.current) ...
    };
  }, [imageUrl, hotspots, autoLoad]);

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden shadow-2xl border border-border">
      <div ref={viewerContainerRef} className="w-full h-full" />

      {/* Info Panel Overlay */}
      {showInfo && (
        <div className="absolute bottom-6 left-6 z-10 w-80 bg-black/90 text-white p-5 rounded-lg backdrop-blur-sm border border-white/10 animate-fade-in">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-cyan-400 text-lg flex items-center gap-2">
              <Info className="h-4 w-4" />
              {infoContent.title}
            </h3>
            <button
              onClick={() => setShowInfo(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-gray-200 text-sm leading-relaxed">
            {infoContent.text}
          </p>
          <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInfo(false)}
              className="text-xs h-8 text-gray-300 hover:text-white hover:bg-white/10"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      <style>{`
        .custom-hotspot {
            width: 24px;
            height: 24px;
            background: rgba(239, 68, 68, 0.9); /* Red-500 */
            border-radius: 50%;
            border: 2px solid white;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            transition: transform 0.2s;
            animation: pulse-ring 2s infinite;
        }
        .custom-hotspot:hover {
            transform: scale(1.2);
            background: #ff0000;
        }
        
        @keyframes pulse-ring {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
    </div>
  );
}
