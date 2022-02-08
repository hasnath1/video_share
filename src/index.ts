import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(
  cors({
    origin: true,
  })
);

app.use(morgan("dev"));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
