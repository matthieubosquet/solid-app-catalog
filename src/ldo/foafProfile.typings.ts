import { LdoJsonldContext, LdSet } from "@ldo/ldo";

/**
 * =============================================================================
 * Typescript Typings for foafProfile
 * =============================================================================
 */

/**
 * FoafProfile Type
 */
export interface FoafProfile {
  "@id"?: string;
  "@context"?: LdoJsonldContext;
  name?: string;
  img?: string;
  knows?: LdSet<FoafProfile>;
}
