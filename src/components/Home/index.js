import {Component} from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import ProjectItem from '../ProjectItem'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstant = {
  intial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    category: categoriesList[0].id,
    activeProjectList: [],
    isLoading: false,
    apiStatus: apiStatusConstant.initial,
  }

  componentDidMount() {
    this.getProjectDetails()
  }

  onChangeOption = event => {
    this.setState({category: event.target.value}, this.getProjectDetails)
  }

  getProjectDetails = async () => {
    this.setState({isLoading: true, apiStatus: apiStatusConstant.inProgress})
    const {category} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${category}`

    const response = await fetch(url)
    console.log(response)

    if (response.status === 200) {
      const data = await response.json()
      const formattedData = data.projects.map(eachItem => ({
        id: eachItem.id,
        imageUrl: eachItem.image_url,
        name: eachItem.name,
      }))
      this.setState({
        activeProjectList: formattedData,
        isLoading: false,
        apiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({isLoading: false, apiStatus: apiStatusConstant.failure})
    }
  }

  renderSuccessView = () => {
    const {activeProjectList} = this.state
    return (
      <>
        <ul className="unordered-list">
          {activeProjectList.map(eachItem => (
            <ProjectItem key={eachItem.id} projectDetail={eachItem} />
          ))}
        </ul>
      </>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.getProjectDetails()}>
        Retry
      </button>
    </div>
  )

  renderOutput = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.renderSuccessView()
      case apiStatusConstant.failure:
        return this.renderFailureView()
      case apiStatusConstant.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {category, activeProjectList, isLoading, apiStatus} = this.state
    console.log(category)
    return (
      <div className="home-container">
        <div className="home-app-container">
          <div className="top-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png "
              alt="website logo"
              className="website-logo"
            />
          </div>
          <div className="form-container">
            <form>
              <select
                className="drop-down-style"
                onChange={this.onChangeOption}
              >
                {categoriesList.map(eachCategory => (
                  <option key={eachCategory.id} value={eachCategory.id}>
                    {eachCategory.displayText}
                  </option>
                ))}
              </select>
            </form>
          </div>
          {this.renderOutput()}
        </div>
      </div>
    )
  }
}
export default Home
