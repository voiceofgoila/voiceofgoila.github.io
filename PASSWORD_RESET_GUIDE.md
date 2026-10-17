# Voice of Goila v4.4 – Password Recovery

1. Deploy all files to the live Cloudflare Pages site, including `reset-password.html` and modified `index.html`, `admin.html`.
2. Supabase > Authentication > URL Configuration: Site URL `https://voiceofgoila.pages.dev`.
3. Add exact Redirect URL `https://voiceofgoila.pages.dev/reset-password.html` (the existing wildcard can remain).
4. From `admin.html` click “পাসওয়ার্ড ভুলে গেছেন?”, enter the existing admin email and request a recovery email. The email link opens `reset-password.html` and presents a new-password form.
5. Supabase Dashboard > Authentication > Users > Send password recovery uses the Site URL rather than the custom redirect; `index.html` forwards recovery hash links to the recovery form. For the most reliable experience, use the new form.
6. Existing `admin_users` role and `js/admin.js` data-management logic are preserved. Test in the deployed site, not file://. Recovery links expire and can be used only once.
7. If the email template is customized, make sure the confirmation URL includes the recovery tokens and type. Do not share reset links or passwords.
