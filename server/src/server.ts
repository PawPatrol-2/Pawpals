// Server startfil
import app from './app';
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servern körs på port ${PORT}`);
});
