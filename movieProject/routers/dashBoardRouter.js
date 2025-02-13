const express = require('express');
const upload = require('../config/multer');
const { userModel, movieModel } = require('../models/userModels');
const dashBoardRouter = express.Router();

dashBoardRouter.get('/', (req, res) => {
    res.render("movie");
  })
  dashBoardRouter.get('/createUser', (req, res) => {
    res.render("createUser");
  })
  dashBoardRouter.get('/managemovies',async (req, res) => {
    try {
      const movies = await movieModel.find({}); 
      console.log("Movies fetched:", movies); 
      res.render('managemovies', { movies }); 
    } catch (error) {
      console.log(error);
    }
  })
  
  // signIn data
  dashBoardRouter.post('/', upload.single('image') ,async (req, res) => {
    const { userName, password } = req.body;
    console.log("Received post data");
    console.log(req.body);
    try {
      const user = await userModel.findOne({});
      console.log(user);
      console.log(req.body.userName);
  
      if (!user) {
        return res.redirect('/signin');
      }
      if (user.password !== password) {
        return res.redirect('/signin');
      }
      res.redirect('/managemovies');
  
    } catch (error) {
      console.log(error);
    }
  });
  
  
  // create data 
  dashBoardRouter.post('/createData', upload.single('image'), async (req, res) => {
    try {
      console.log(req.body);
      if (req.file) {
        req.body.image = "/uploads/" + req.file.filename;
      }
      await userModel.create(req.body);
      console.log("User created successfully.");
      res.redirect('/managemovies');
    } catch (error) {
      console.log(error);
    }
  });
  
  // add movie data
  dashBoardRouter.post('/addMovie', upload.single('picture'), async (req, res) => { 
    try {
      console.log(req.body);
      if (req.file) {
        req.body.picture = "/uploads/" + req.file.filename; 
      }
      await movieModel.create(req.body);
      console.log("Movie created successfully.");
      res.redirect('/managemovies');
    }
    catch (error) {
      console.log(error);
      res.send("Error creating movie"); 
    }
  });
  
  // receive movie data
  dashBoardRouter.get('/movies', async (req, res) => {
    try {
        const movies = await movieModel.find(); 
        res.json(movies); 
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching movies" });
    }
  });
  
  // delete movies
  
  dashBoardRouter.post('/deleteMovies', async (req, res) => {
    const { movieIds } = req.body;
    try {
        const result = await movieModel.deleteMany({ _id: { $in: movieIds } });
        if (result.deletedCount > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, dashBoardRouter});
    }
  });
  
  // edit movies
  dashBoardRouter.get('/movie/:id', async (req, res) => {
    try {
        const movie = await movieModel.findById(req.params.id);
        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching movie details' });
    }
  });
  
  
  // update movie data
  
  dashBoardRouter.post('/editMovie', upload.single('picture'), async (req, res) => {
    try {
      const { movieId, title, genre, description, releaseDate } = req.body;
      let updatedData = { title, genre, description, releaseDate };
  
      if (req.file) {
        updatedData.picture = "/uploads/" + req.file.filename; 
      }
      const updatedMovie = await movieModel.findByIdAndUpdate(movieId, updatedData, { new: true });
  
      if (updatedMovie) {
        res.json({ success: true, movie: updatedMovie });
      } else {
        res.json({ success: false, message: 'Movie not found' });
      }
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: 'Failed to update movie' });
    }
  });
  

module.exports = dashBoardRouter;