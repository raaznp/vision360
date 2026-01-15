// @ts-ignore
import warehouseScene from "@/assets/courses/TruckLoadingandUnloadingSafety/scene 1.jpeg";

export interface TourHotspot {
  pitch: number;
  yaw: number;
  createTooltipArgs: {
    title: string;
    text: string;
  };
}

export interface TourConfig {
  imageUrl: string;
  hotspots: TourHotspot[];
}

// Map key format: "courseId:lessonTitle" or just "lessonTitle" if unique enough, 
// but "courseId:lessonTitle" is safer for scalability.
// Actually, using lesson ID would be best if we had stable IDs, but titles from the DB are what we have in the frontend state currently easily accessbile without fetching extra generic metadata.
// Let's use a matching function or map by string for now.

export const tourConfigs: Record<string, TourConfig> = {
  "Introduction to Loading Safety": {
    imageUrl: warehouseScene,
    hotspots: [
      {
        pitch: -10,
        yaw: -30,
        createTooltipArgs: {
          title: 'Forklift Operating Area',
          text: 'Forklifts operate in this area. Only trained operators should drive forklifts, and pedestrians must keep a safe distance to avoid accidents.'
        }
      },
      {
        pitch: -8,
        yaw: 35,
        createTooltipArgs: {
          title: 'Truck Loading and Unloading Bay',
          text: 'This is the truck loading and unloading zone. Vehicles must be properly parked and secured before loading begins.'
        }
      },
      {
        pitch: -2,
        yaw: -10,
        createTooltipArgs: {
          title: 'Personal Protective Equipment (PPE)',
          text: 'Workers are required to wear PPE such as helmets and high-visibility vests in this high-risk area.'
        }
      },
      {
        pitch: -20,
        yaw: 0,
        createTooltipArgs: {
          title: 'Pedestrian Safety Zone',
          text: 'Pedestrian safety zones help separate workers from moving vehicles and reduce the risk of collisions.'
        }
      },
      {
        pitch: -12,
        yaw: -10,
        createTooltipArgs: {
          title: 'Material Handling and Pallet Area',
          text: 'Materials must be stacked properly to prevent falling objects and workplace injuries.'
        }
      },
      {
        pitch: 6.5,
        yaw: -70,
        createTooltipArgs: {
          title: 'Storage Shelf and Racking Area',
          text: 'Storage shelves must not be overloaded, and materials should be secured properly to prevent falling objects and serious injuries.'
        }
      }
    ]
  }
};
