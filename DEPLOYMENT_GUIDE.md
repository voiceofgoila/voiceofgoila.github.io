# Voice of Goila deployment guide

This package retains all files from the provided GitHub repository, replacing only index.html with the provided v2.7 version and adding category.html and the two drone images. All existing JavaScript, Supabase config, admin, submission, APK, manifest, service worker, asset links and icons remain byte-identical.

Before deployment:
1. Back up the current GitHub repository and database.
2. Extract this ZIP and upload the CONTENTS of the voiceofgoila.github.io-main folder to the repository root (not the enclosing folder).
3. Keep any server-side files or GitHub settings that are not in the provided archive. Do not delete unrelated files.
4. Deploy to a staging branch first if possible.
5. Test home page, category page, directory, search, submission, admin login, database read/write, APK links, PWA installation, and Android app deep links.
6. If any feature fails, revert the Git commit.

This is a static file merge. It does not migrate or alter the live Supabase database or the Android APK. Live compatibility cannot be guaranteed without testing against the deployed environment.
