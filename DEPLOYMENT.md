# Static Deployment Instructions

## GitHub Pages

1. Create a repository, for example `dact-browser-classifier`.
2. Copy these files into the repository root:
   - `index.html`
   - `assets/`
   - `examples/` if you want to provide bundled synthetic artefacts
   - `README.md`
3. Commit and push.
4. Open **Settings → Pages**.
5. Set source to **Deploy from a branch**.
6. Select `main` and `/root`.
7. Save.
8. Open the public Pages URL.

## Netlify

1. Drag the whole folder into Netlify's site deploy page, or connect a Git repository.
2. Build command: leave blank.
3. Publish directory: root directory.

## Vercel

1. Import the repository into Vercel.
2. Framework preset: Other.
3. Build command: leave blank.
4. Output directory: root directory.

## Local static preview

```bash
python3 -m http.server 8000
```

Then open `http://127.0.0.1:8000`.

## Deploying the Example Use Cases page

The `examples.html` page is fully static and can be deployed with the rest of the repository. Upload the following files and directories:

```text
index.html
examples.html
assets/
examples/
README.md
DEPLOYMENT.md
```

The example page uses browser `fetch()` calls to read files from the `examples/full_taxonomy_corpus/` directory. It should therefore be served from a local or public web server. Opening `examples.html` directly from the local filesystem may prevent previews or example execution in some browsers because of local file access restrictions.

For local testing, use:

```bash
python -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000/examples.html
```


## Additional advisory pages

The repository root should also include:

```text
readiness.html
playbook.html
evidence.html
assets/readiness.js
assets/playbook.js
```

These files provide the readiness assessment, incident response playbook generator, and evidence/log collection guide.
