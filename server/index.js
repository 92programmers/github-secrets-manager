
import express from 'express'
import { OAuthApp } from "octokit";
import cors from 'cors'
import 'dotenv/config'

const app = express()
const port = 3000

app.use(cors());
app.use(express.json())

const clientId = process.env.VITE_GITHUB_CLIENT_ID
const clientSecret = process.env.VITE_GITHUB_CLIENT_SECRET

const oAuthApp = new OAuthApp({
  clientId,
  clientSecret,
  defaultScopes: ["repo", "gist", "user", "project", "admin:org"]
});

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})