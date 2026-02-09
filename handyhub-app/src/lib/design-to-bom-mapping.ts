import type { DesignIdea } from "@/types/database";
import { SpaceType } from "@/types/database";

/**
 * Maps a design gallery RoomType string to a BOM SpaceType.
 */
export function mapRoomToSpace(roomType: string): SpaceType {
  const map: Record<string, SpaceType> = {
    bathroom: SpaceType.BATHROOM,
    kitchen: SpaceType.KITCHEN,
    living_room: SpaceType.LIVING_ROOM,
    bedroom: SpaceType.BEDROOM,
    dining_room: SpaceType.OTHER,
    home_office: SpaceType.OTHER,
    laundry: SpaceType.LAUNDRY,
    mudroom: SpaceType.OTHER,
    nursery: SpaceType.BEDROOM,
    outdoor: SpaceType.OUTDOOR,
    entryway: SpaceType.OTHER,
    garage: SpaceType.GARAGE,
    other: SpaceType.OTHER,
  };
  return map[roomType] ?? SpaceType.OTHER;
}

/**
 * Maps a design gallery RoomType string to a BOM category_slug.
 * Returns empty string for room types that don't have a clear category match,
 * so the user can pick manually.
 */
export function mapRoomToCategory(roomType: string): string {
  const map: Record<string, string> = {
    bathroom: "bathroom-remodel",
    kitchen: "kitchen-remodel",
    laundry: "general-handyman",
    garage: "general-handyman",
  };
  return map[roomType] ?? "";
}

/**
 * Builds a project description pre-filled from a design idea.
 */
export function buildDesignDescription(design: DesignIdea): string {
  const style = design.style.replace(/_/g, " ");
  const room = design.room_type.replace(/_/g, " ");

  let desc = `I want to recreate a ${style} ${room} design. Reference: "${design.title}".`;

  if (design.description) {
    // Take first 300 chars of the original description
    const trimmed =
      design.description.length > 300
        ? design.description.slice(0, 300) + "..."
        : design.description;
    desc += ` ${trimmed}`;
  }

  if (design.product_tags.length > 0) {
    const products = design.product_tags
      .slice(0, 5)
      .map((t) => {
        const category = t.product_category.replace(/_/g, " ");
        return `${t.product_name} (${category})`;
      })
      .join(", ");
    desc += ` Key products: ${products}.`;
  }

  return desc;
}
