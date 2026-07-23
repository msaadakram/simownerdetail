# Plan: Language-Based Audio Transcription (Groq)

## Goal
Add an option to transcribe audio according to a selected language. After initial transcription (Whisper), send the text to Groq AI (LLaMA 3.3 70B) to process/rewrite the transcript according to the user's selected language (e.g., translate or format for that language).

## Components

### 1. Backend (`ytback`)
- **File:** `src/core/transcription.js`
  - Modify `transcribeWithGroq()` to accept an optional `language` parameter.
  - After getting `text` and `segments` from Whisper, if `language` is provided:
    - Call Groq chat completions (`llama-3.3-70b-versatile`) with the transcript text.
    - Prompt: "Translate/rewrite the following transcript to {language}: {text}"
    - Replace `text` with AI-processed result. Optionally keep original segments or translate segment texts too.
- **File:** `src/modules/transcription/transcription.controller.js`
  - Update `transcribeMedia` to read `language` from request (`req.validated.language`).
  - Pass `language` into `transcribeAudio()` and then to `transcribeWithGroq()`.
- **File:** `src/core/transcription.js` (`transcribeAudio`)
  - Accept `language` in job object or function args and propagate.

### 2. Frontend (`yt-dlp-next`)
- **File:** Components/pages for transcript/audio download.
  - Find the component rendering the download/selection UI (`DownloadOnlyHero` or similar) and add a `<select>` dropdown for language selection.
  - Languages: en, es, fr, de, pt, ja, ar, ru, zh (matching existing locales) plus any additional ones as needed.
- Pass selected `language` to the API call (`universalDownloadTranscript` or similar in `lib/api-client.ts`).

### 3. API Client (`yt-dlp-next/lib/api-client.ts` or similar)
- Ensure the transcript/download endpoint sends `language` as part of the request payload.

### 4. Groq Integration Details (Python snippet reference)
- The user's provided Python snippet shows streaming with `llama-3.3-70b-versatile`. For backend Node.js, we use `groq-sdk` which is already a dependency (`groq-sdk: ^1.3.0` in `ytback/package.json`).
- Node code for AI processing:
  ```js
  const groq = new Groq({ apiKey: config.groqApiKey });
  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: `Translate/rewrite this transcript to ${language}:\n${text}` }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
  });
  const processedText = chatCompletion.choices[0]?.message?.content || text;
  ```

## Steps
1. Update backend transcription functions to accept language.
2. Add language processing via Groq chat API after Whisper.
3. Update frontend to show language dropdown.
4. Update frontend API calls to include selected language.
5. Test pipeline end-to-end.
