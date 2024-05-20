
import express from 'express'
import { OAuthApp } from "octokit";
import cors from 'cors'
import 'dotenv/config'
import path from 'path';

const app = express()
const port = 3000
const __dirname = path.dirname(new URL(import.meta.url).pathname); // Define __dirname using import.meta.url

app.use(cors());
app.use(express.json())

const clientId = process.env.VITE_GITHUB_CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET

const oAuthApp = new OAuthApp({
  clientId,
  clientSecret,
  defaultScopes: ["repo", "gist", "user", "project", "admin:org"]
});

const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.post('/access-token', async (req, res) => {
  const { code, state, accessToken } = req.body
  try {
    const token = await oAuthApp.createToken({ code, state })
    res.json(token)
  } catch (error) {
    const token = await oAuthApp.resetToken({ token: accessToken })
    res.json(token)
  }
})

// Route for handling all other routes (for Vue Router's HTML5 history mode)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})