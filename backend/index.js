import express from 'express'
import postRoutes from "./routes/posts.js"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/posts.js"

const app = express()
app.use(express.json())
app.use("/api/auth", postsRoutes)
app.use("/api/users", postsRoutes)
app.use("/api/posts", postsRoutes)

app.get("/homegardening", (req, res) => {
    res.json("funziona")
})
app.listen(3000, ()=>{
    console.log("Connesso...")
})