const express = require('express');
const dotenv = require('dotenv'); 
const connectDB = require('./config/db'); 


dotenv.config();
const app = express();
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const financeRoutes = require('./routes/financeRoutes');
const reminderRoutes = require('./routes/reminderRoutes'); 

app.use('/api/users', userRoutes);
app.use('/api/finances', financeRoutes);
app.use('/api/reminders', reminderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));

connectDB();