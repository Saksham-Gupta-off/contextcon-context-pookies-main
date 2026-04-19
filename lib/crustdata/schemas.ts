import { z } from "zod";

const nullableString = z.string().nullable().optional();
const nullableStringArray = z.array(z.string()).nullable().optional();
const nullableNumber = z.number().nullable().optional();

const growthMetricsSchema = z.object({
  mom: nullableNumber,
  qoq: nullableNumber,
  six_months: nullableNumber,
  yoy: nullableNumber,
  two_years: nullableNumber,
});

const trafficSnapshotSchema = z
  .object({
    monthly_visitors: nullableNumber,
  })
  .passthrough();

export const autocompleteSuggestionSchema = z.object({
  value: z.string(),
});

export const companyAutocompleteResponseSchema = z.object({
  suggestions: z.array(autocompleteSuggestionSchema),
});

export const personAutocompleteResponseSchema = z.object({
  suggestions: z.array(autocompleteSuggestionSchema),
});

const basicCompanyInfoSchema = z.object({
  crustdata_company_id: nullableNumber,
  name: nullableString,
  primary_domain: nullableString,
  website: nullableString,
  description: nullableString,
  professional_network_url: nullableString,
  year_founded: nullableString,
  industries: nullableStringArray,
});

const companyFundingSchema = z.object({
  total_investment_usd: nullableNumber,
  last_round_amount_usd: nullableNumber,
  last_fundraise_date: nullableString,
  last_round_type: nullableString,
  investors: nullableStringArray,
});

const companyHeadcountSchema = z
  .object({
    total: nullableNumber,
    latest_count: nullableNumber,
    growth_percent: z.union([nullableNumber, growthMetricsSchema]).optional(),
  })
  .transform((value) => ({
    total: value.total ?? value.latest_count ?? null,
    growth_percent: value.growth_percent ?? null,
  }));

const companyLocationSchema = z.object({
  hq_country: nullableString,
  hq_state: nullableString,
  hq_city: nullableString,
  headquarters: nullableString,
});

const companyTaxonomySchema = z.object({
  professional_network_industry: nullableString,
  categories: nullableStringArray,
  professional_network_specialities: nullableStringArray,
});

const companyHiringSchema = z.object({
  openings_count: nullableNumber,
  openings_growth_percent: z.union([nullableNumber, growthMetricsSchema]).optional(),
  recent_titles_csv: nullableString,
});

const companyWebTrafficSchema = z.object({
  domain_traffic: z.union([trafficSnapshotSchema, z.record(z.string(), trafficSnapshotSchema)]).optional(),
});

const companyPersonLiteSchema = z.object({
  name: nullableString,
  title: nullableString,
  professional_network_profile_url: nullableString,
  current_company_name: nullableString,
  joined_date: nullableString,
});

const companyPeopleSchema = z.object({
  decision_makers: z.array(companyPersonLiteSchema).optional(),
  founders: z.array(companyPersonLiteSchema).optional(),
  cxos: z.array(companyPersonLiteSchema).optional(),
});

const companyNewsItemSchema = z.object({
  article_url: nullableString,
  article_title: nullableString,
  article_publish_date: nullableString,
});

const companyCompetitorsSchema = z.object({
  company_ids: z.array(z.number()).nullable().optional(),
  websites: nullableStringArray,
});

export const companySearchCompanySchema = z.object({
  crustdata_company_id: z.number(),
  basic_info: basicCompanyInfoSchema.optional(),
  funding: companyFundingSchema.optional(),
  headcount: companyHeadcountSchema.optional(),
  locations: companyLocationSchema.optional(),
  taxonomy: companyTaxonomySchema.optional(),
  hiring: companyHiringSchema.optional(),
  web_traffic: companyWebTrafficSchema.optional(),
  people: companyPeopleSchema.optional(),
  competitors: companyCompetitorsSchema.optional(),
  news: z.array(companyNewsItemSchema).optional(),
});

export const companySearchResponseSchema = z.object({
  companies: z.array(companySearchCompanySchema),
  next_cursor: z.string().nullable().optional(),
  total_count: z.number().nullable().optional(),
});

export const companyMatchSchema = z.object({
  confidence_score: z.number(),
  company_data: z.object({
    crustdata_company_id: z.number(),
    basic_info: basicCompanyInfoSchema.optional(),
    funding: companyFundingSchema.optional(),
    headcount: companyHeadcountSchema.optional(),
    locations: companyLocationSchema.optional(),
    taxonomy: companyTaxonomySchema.optional(),
    hiring: companyHiringSchema.optional(),
    web_traffic: companyWebTrafficSchema.optional(),
    people: companyPeopleSchema.optional(),
    competitors: companyCompetitorsSchema.optional(),
    news: z.array(companyNewsItemSchema).optional(),
  }),
});

export const companyArrayEnvelopeSchema = z.array(
  z.object({
    matched_on: z.string(),
    match_type: z.string(),
    matches: z.array(companyMatchSchema),
  }),
);

const personBasicProfileSchema = z.object({
  name: z.string().optional(),
  headline: z.string().optional(),
  current_title: z.string().optional(),
  summary: z.string().optional(),
  location: z.string().optional(),
});

const personExperienceSchema = z.object({
  employment_details: z
    .object({
      current: z
        .array(
          z.object({
            company_name: z.string().optional(),
            title: z.string().optional(),
            start_date: z.string().optional(),
          }),
        )
        .optional(),
      past: z
        .array(
          z.object({
            company_name: z.string().optional(),
            title: z.string().optional(),
            start_date: z.string().optional(),
            end_date: z.string().optional(),
          }),
        )
        .optional(),
    })
    .optional(),
});

const personSocialHandlesSchema = z.object({
  twitter_identifier: z
    .object({
      slug: z.string().optional(),
    })
    .optional(),
});

const personProfessionalNetworkSchema = z.object({
  followers: z.number().nullable().optional(),
  connections: z.number().nullable().optional(),
});

const personEducationSchema = z.object({
  schools: z
    .array(
      z.object({
        school_name: z.string().optional(),
        degree_name: z.string().optional(),
      }),
    )
    .optional(),
});

export const personSearchPersonSchema = z.object({
  crustdata_person_id: z.number().optional(),
  basic_profile: personBasicProfileSchema.optional(),
  professional_network: personProfessionalNetworkSchema.optional(),
  social_handles: personSocialHandlesSchema.optional(),
  experience: personExperienceSchema.optional(),
  education: personEducationSchema.optional(),
  recently_changed_jobs: z.boolean().nullable().optional(),
});

export const personSearchResponseSchema = z.object({
  people: z.array(personSearchPersonSchema),
  next_cursor: z.string().nullable().optional(),
  total_count: z.number().nullable().optional(),
});

export const personArrayEnvelopeSchema = z.array(
  z.object({
    matched_on: z.string(),
    match_type: z.string(),
    matches: z.array(
      z.object({
        confidence_score: z.number(),
        person_data: personSearchPersonSchema,
      }),
    ),
  }),
);

export const webSearchResultSchema = z.object({
  source: z.string(),
  title: z.string().optional(),
  url: z.string().optional(),
  snippet: z.string().optional(),
  position: z.number().optional(),
});

export const webSearchResponseSchema = z.object({
  success: z.boolean(),
  query: z.string(),
  timestamp: z.number(),
  results: z.array(webSearchResultSchema),
  metadata: z
    .object({
      totalResults: z.number().optional(),
      failedPages: z.array(z.number()).optional(),
      emptyPages: z.array(z.number()).optional(),
    })
    .optional(),
});

export const webFetchResponseSchema = z.array(
  z.object({
    success: z.boolean(),
    url: z.string().nullable(),
    timestamp: z.number().nullable(),
    title: z.string().nullable(),
    content: z.string().nullable(),
  }),
);

export type CompanySearchResponse = z.infer<typeof companySearchResponseSchema>;
export type CompanyAutocompleteResponse = z.infer<
  typeof companyAutocompleteResponseSchema
>;
export type CompanyArrayEnvelope = z.infer<typeof companyArrayEnvelopeSchema>;
export type PersonSearchResponse = z.infer<typeof personSearchResponseSchema>;
export type PersonAutocompleteResponse = z.infer<
  typeof personAutocompleteResponseSchema
>;
export type PersonArrayEnvelope = z.infer<typeof personArrayEnvelopeSchema>;
export type WebSearchResponse = z.infer<typeof webSearchResponseSchema>;
export type WebFetchResponse = z.infer<typeof webFetchResponseSchema>;
