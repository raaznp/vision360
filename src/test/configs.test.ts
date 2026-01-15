import { describe, it, expect } from 'vitest';
import { tourConfigs } from '@/config/tourConfig';
import { videoConfigs } from '@/config/videoConfig';

describe('Configuration Validation', () => {

  describe('Tour Config', () => {
    it('should have valid tour configurations', () => {
      Object.values(tourConfigs).forEach((config) => {
        expect(config.imageUrl).toBeDefined();
        expect(config.imageUrl).not.toBe('');
        expect(Array.isArray(config.hotspots)).toBe(true);
      });
    });

    it('should have properly formatted hotspots', () => {
       const firstTour = Object.values(tourConfigs)[0];
       if (firstTour && firstTour.hotspots.length > 0) {
           const hotspot = firstTour.hotspots[0];
           expect(hotspot.pitch).toBeTypeOf('number');
           expect(hotspot.yaw).toBeTypeOf('number');
           expect(hotspot.createTooltipArgs).toBeDefined();
           expect(hotspot.createTooltipArgs.title).toBeDefined();
           expect(hotspot.createTooltipArgs.text).toBeDefined();
       }
    });
  });

  describe('Video Config', () => {
    it('should have valid video configurations', () => {
        const keys = Object.keys(videoConfigs);
        expect(keys.length).toBeGreaterThan(0);

        Object.values(videoConfigs).forEach((config) => {
            expect(config.videoId).toBeDefined();
            expect(config.videoId.length).toBeGreaterThan(0);
            expect(config.title).toBeDefined();
            expect(config.description).toBeDefined();
        });
    });
  });
});
