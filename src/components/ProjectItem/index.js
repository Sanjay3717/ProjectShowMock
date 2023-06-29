import './index.css'

const ProjectItem = props => {
  const {projectDetail} = props
  const {name, imageUrl} = projectDetail
  return (
    <li className="list-item">
      <img src={imageUrl} alt={name} className="project-item-image" />
      <p className="project-name">{name}</p>
    </li>
  )
}
export default ProjectItem
