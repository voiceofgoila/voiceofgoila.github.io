# Voice of Goila — Admin integration

- Footer links in `index.html` and `category.html` open the existing `admin.html` in the same website.
- Existing dashboard modules, forms and database calls are preserved.
- Critical login flow fix in `js/admin.js`: dashboard only displays after checking `admin_users` for the authenticated user.
- Non-admin users are signed out after denial.
- This is not a substitute for Supabase Row Level Security policies. Verify RLS on all tables and storage buckets, especially write/delete operations, before publishing.
- No production database access or browser end-to-end test was performed.
- Deploy the entire folder contents at your GitHub Pages publishing root.
