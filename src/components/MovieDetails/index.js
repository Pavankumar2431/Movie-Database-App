import {Component} from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

class MovieItemDetails extends Component {
  state = {movieData: {}, cast: {}, isLoading: true}

  componentDidMount() {
    this.getMovieItemData()
  }

  getMovieItemData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const API_KEY = 'f32b79895b21468afbdd6d5342cbf3da'
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`,
    )
    const data = await response.json()

    const response2 = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=en-US`,
    )
    const castData = await response2.json()
    console.log(castData)

    const genresArray = data.genres.map(genre => genre.name) // ['Crime', 'Horror', 'Thriller']
    const genresString = genresArray.join(', ') // 'Crime, Horror, Thriller'

    const updatedData = {
      title: data.title,
      image: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
      ratings: data.vote_average,
      duration: data.runtime,
      genre: genresString, // 'Crime, Horror, Thriller'
      releasedate: data.release_date,
      overview: data.overview,
    }
    const updatedCastData = castData.cast.map(actor => ({
      originalName: actor.name,
      castImage: actor.profile_path
        ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
        : null,
      characterName: actor.character,
    }))

    this.setState({
      movieData: updatedData,
      cast: updatedCastData,
      isLoading: false,
    })
  }

  renderMovieItemDetails = () => {
    const {movieData, cast} = this.state
    const {
      title,
      image,
      ratings,
      duration,
      genre,
      releasedate,
      overview,
      originalName,
      castImage,
      characterName,
    } = movieData
    return (
      <div className="movie-info">
        <h1>Movie Details</h1>
        <h2 className="movie-details-title">Title:{title}</h2>

        <div className="movie-details">
          <img className="movie-image" src={image} alt={title} />
          <div>
            <p className="rating">Ratings: {ratings}</p>
            <p>Duration: {duration}</p>
            <p>Genre: {genre}</p>
            <p>Release Date: {releasedate}</p>
            <p className="overview">Overview: {overview}</p>
          </div>
        </div>
        <h2>Cast Details:</h2>
        <div>
          <ul className="cast-section">
            {cast.map(eachcast => (
              <li className="cast-item">
                <img
                  className="cast-image"
                  src={eachcast.castImage}
                  alt={originalName}
                />
                <p className="originalName">Name: {eachcast.originalName}</p>
                <p className="character">
                  Character name: {eachcast.characterName}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  render() {
    const {isLoading} = this.state
    return (
      <div className="blog-container">
        {isLoading ? (
          <div className="loader">
            <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
          </div>
        ) : (
          this.renderMovieItemDetails()
        )}
      </div>
    )
  }
}

export default MovieItemDetails
