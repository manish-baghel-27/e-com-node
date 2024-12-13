const express =  require('express');
// routes
const productsRouter = require('./routes/productRoutes');
const moviesRouter = require('./routes/moviesRoutes');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRoute');
const categoryRouter = require('./routes/categoryRoute');
const tagRouter = require('./routes/tagRoute');
const postRouter = require('./routes/postRoutes');
// 
const CustomError = require('./utils/CustomError');
const globalErrorHandler = require('./controllers/errorController');
// security
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const sanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors'); // Import the cors package
// data pollution
// const hpp = require('hpp');
// 
const morgan = require('morgan');


let app = express();
// Define the CORS options
const corsOptions = {
    credentials: true,
    origin: ['http://localhost:3000', 'https://everlywell-next-app.vercel.app'] // Whitelist the domains you want to allow
};
app.use(cors(corsOptions)); // Use the cors middleware with your options

app.use(helmet());

let limiter = rateLimit({
    max: 1000,
    windowMs: 60*60*1000,
    message: "We have received too many requests from this IP. Please try after one hour",
})
app.use('/api', limiter);

app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({ extended: false }));
app.use(sanitize());
app.use(xss());
// app.use(hpp({whitelist: ['name']}));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// routes
app.use('/api/movies',moviesRouter);
app.use('/api/tags', tagRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/auth',authRouter);
app.use('/api/users',userRouter);
app.use('/api/posts', postRouter);
app.all('*', (req, res, next)=>{
    const err = new CustomError(`can't find ${req.originalUrl} on the server!`, 404);
    next(err);
})

// global error handling
app.use(globalErrorHandler);

module.exports = app;