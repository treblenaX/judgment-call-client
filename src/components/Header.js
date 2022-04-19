import '../styles/Header.scss';

function Header(props) {
    const title = props.title;
    return (
        <h1 id='title'>{title}</h1>
    )
}

export default Header;