import { describe, expect, it } from 'vitest'

import { ApiQueryParamsSchema } from '@/shared/schemas/api.schema'

describe('ApiQueryParamsSchema', () => {
  it('returns defaults when input is undefined', () => {
    expect(ApiQueryParamsSchema.parse(undefined)).toMatchObject({
      _page: '1',
      _per_page: '10',
    })
  })

  it('returns defaults when input is empty object', () => {
    expect(ApiQueryParamsSchema.parse({})).toMatchObject({
      _page: '1',
      _per_page: '10',
    })
  })
})
