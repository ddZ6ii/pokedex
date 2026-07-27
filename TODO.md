- [x] Add react-error-boundary

- [x] Add global error boundary (last-resort) and test

- [x] Add local (around pokemon list) error boundary (widget error) + test

- [x] Find a robust way to discriminate/manage errors (normalize and bubble, fetch retry, ui local messages, or app crash via error boundary...)

- [x] Display PokemonList as cards

- [x] Use skeleton for Pokemon cards

- [x] Make navbar sticky

- [x] Reproduce error-boundary global in react-shadcn-tailwind starter + add JSdoc to useSystemModeSync

- [x] Replace useFetch by useQuery

- [x] Replace useQuery by useSuspenseQuery

- [x] Implement paginated query
- [x] Fix json-server wrong sorting order (select method for the fetch function)
- [x] Implmement pagination
- [x] Update `scrollThreshold` in header.tsx now the page show less pokemon cards
- [x] Smoothen new fetch: wrap the updates that change the QueryKey into React startTransition to prevent the UI from being replaced by a fallback during an update
- [x] Make sure to pre-fetch data on hovering pagination buttons
- [x] Check the integration test with msw then ammend commit + add new description line

- [x] Create a select component with predefined limits/page
- [x] Link the skeleton number for a pokemon card to the default value for page limit
- [x] Store limit and current page into zustand dedicated slice store
- [x] Ensure zod parses storage data (using schema) before using them
- [x] Add tests for storage filters schema and fix broken ones

- [x] Add SearchBar
- [x] Debounce Search
- [x] Wrap search update into startTransition?
- [x] Replace search input with Input group
- [x] Fix currently broken tests
- [x] Add test to the store schema
- [x] Add integration tests
- [x] 🔥 Understand why 2 initial renders of all components and improve performance

- [x] Reproduce updated button into other starters repo (+ test setup.ts)

- [x] Improve accessibility for all icons (aria-hidden: true)

- [x] Review pagination entirely (look for more appealing UI, display currentPage / maxPage, remove numbering ?)

- [x] Fix layout filters + search responsiveness

- [x] Add sorting: by Stat, by Name, by Type
  - [x] Make reusable Select component (render options props)
  - [x] Add visual indicators to show current sorting are applied
  - [x] Wire the local state to zustand global store and ensure the query is properly ordered (make sure it works for all the available sort types)
  - [x] Make SortingControls responsive
  - [x] Ensure sort controls are disabled while querying (start transition (desktop only since for mobile apply or reset close the drawer ))
  - [x] Add/update tests
  - [x] Fix runtime warning "Blocked aria-hidden on an element because its descendant retained focus"

- [x] Refactor:
  - [x] Project architecture -> split by feature subfolders
  - [x] Switch all components to named exports
  - [x] Snake case all filenames
  - [x] Ensure to barrel exports only components to externalize
  - [x] Spit the current `sorting.tsx` file into multiple files
  - [x] Split the related test files
  - [x] Fix remaining error in `input-group.tsx`

- [x] Refactor Select component across the application:
  - [x] mode select
  - [x] pagination page-size-picker
  - [x] sorting-controls

- [x] Refactor search component
- [x] Refocus input field (useRef) on clear search

- [x] Update all starter project `tsconfig.app.json` with the linting rule: "noUncheckedIndexedAccess": true

- [x] Refactor store:
  - [x] Move APIParamsSchema and QueryOptions to `shared/schemas` folder
  - [x] Rename "APIParamsSchema" to "ApiQueryParamsSchema" and "ApiParams" to "ApiQueryParams"
  - [x] Split sorting from filter slices
  - [x] Update global store with new store slice

- [x] Add dynamic multi-sort components (mobile and desktop)
  - [x] Update sorting schema (state data structure)
  - [x] Update `sorting-slice`
  - [x] Update `global.store` (bump to v3)
  - [x] Update `store.schema`
  - [x] Update `api.schema` with updated sort
  - [x] Create (shared?) `multi-sort.tsx` component
  - `sorting-mobile`:
    - [x] Use the multi-sort in a drawer
    - [x] Add current selected criteria indicator
    - [x] Fix styling for "Remove criteria" button
    - [x] Improve drawer responsiveness
    - [x] Ensure closing the drawer (apply or overlay click) remove any null sorting criteria
    - [x] Fix "unique key props"
    - [x] Enhance responsive: make drawer content scrollable in case all filters are used
    - [x] Enhance responsive: switch from flex-col to flex-row on @md/container
  - [x] Update `sorting.schema` tests
  - [x] Update `sorting-slice` tests
  - [x] Update `store.schema` tests
  - `sorting-desktop`:
    - [x] Use the multi-sort in a popover
    - [x] Refactor code to create a single shared `SortingPanel` shell component between mobile and desktop, sharing the same logic (custom hook `usePanelSorting`) and the same panel content (`SortingPanelContent`)
    - [x] Fix desktop layout: filters and sorting popover buttons should be aligned with the search bar
    - [x] Update all tests and create new if needed
    - [x] On destkop, add filter and sorting labels on buttons
  - Review quality:
    - [x] Make sure all tests pass and are up-to-date
    - [x] Make sure all files pass formatting/linting
    - [x] Make sure no unused types and schema (especially for sorting)
    - [x] Make sure to only barrel export public components

- [x] Add filters:
  - [x] Make each filter into its on Collapsible area with only a single area that can be expanded at a time
  - [x] Min/max sliders for stats (attack, defense, etc.)
    - [x] UI responsive (mobile + desktop)
    - [x] Connect to global store
    - [x] Connect to React Query
    - [x] Add tests (filtering-panel.test.ts)
    - [x] Ask Claude to review the feature
    - [x] Format + lint
  - [x] Combobox (multi-select) for pokemons types (Grass, Fire…)
    - [x] Restructure `db.json` to support type filtering
    - [x] UI responsive (clear selection button for multiselects)
    - [x] Connect to global store
    - [x] Fix bug: Unselect All Types -> Select a couple -> Apply -> Select All : the Apply button is disabled (should be enabled because current global state is not null)
    - [x] Connect to React Query
    - [x] Refactor code since both filtering-popover and filtering-drawer are similar
    - [x] Add tests
    - [x] Format + lint
    - [x] Ask Claude to review the feature

- [x] Security audit (pnpm audit): fix found vulnerabilities (if any)

- [x] Replace popover with dialog for both filtering and sorting?

- [x] Refactor:
  - [x] Create a unified Trigger (sorting/filtering),
  - [x] Create a unified ReponsivePanel (sorting/filtering) and delete FilteringPanel and SortingPanel

- [x] Refactor layout:
  - [x] Split code to components
  - [x] Make the header fixed
  - [x] Make the Pokedex Controls sticky

- [x] Fix bugs:
  - [x] Fix layout shift (full list skeletons being displayed) when a filtered search is displayed
  - [x] Add error message for HTTP status 429
  - [x] Updating sorting while a search is active flashes the whole pokemons list
  - [x] Disable pagination page size select based on the search output (do not enable select if only a single result is shown)
  - [x] Upon filters/sorting/page changes, force the browser to reset the scroll position.
  - [x] Stale filters / sorting count (badge) when adding a filter (or sorting criteria) and closing the drawer without clicking "Apply" (both in mobile and desktop)
  - [x] Header disappearing when search has 4 results (e.g. "bul")
  - [x] Pagination not showing when search has only one single result

- [x] Enhancements:
  - [x] Add a visual stale indicator on pokemon list when refetching in the background
  - [x] Make image bigger on hover
  - [x] Try to remove bottom decorations from png bg images in PS
  - [x] Improve PokemonCard styling (background, icons, fonts....)
  - [x] Invert the 2 filters (pokemon types should be first)
  - [x] Add a short description to each pokemon
  - [x] Updtate card skeleton

- [x] Animate Pokemons cards:
  - [x] Add 3D perspective
  - [x] Add tilt effect on mouse hover
  - [x] Add shimmering on hover
  - [x] Add a guard for preserve-motion

- [x] Fix bugs:
  - [x] Filter popover flashes after selection a pokemon type and clicking on apply
  - [x] UI is fine in Google Chrome, but real bad with Firefox.

- [] Implement tanstack routing
  - [x] Splash screen with animated pokeball, aurora animated background + CTA, main title with animated entrance
  - [x] Default ErrorPage
  - [x] Default LoadingPage
  - [x] Default NotFoundPage
  - [] Pokedex page, switch local state to URL state:
    - [] Fetch data from router loader
    - [] Remove data from store
    - [] Ensure stale data are preserved while refetching to avoid flashing the loading skeleton on screen
    - [] Ensure error, not found and loading state are correctly handled
  - [] Add Pokemon page (pokemonId) OR modal with detailed pokemon view of characteristics

- [] Deploy to prod:
  - [] Replace current dummy json-server API with real API (https://pokeapi.co/)
  - [] Conteneurize the app
  - [] Audit/fix vulnerabilities
