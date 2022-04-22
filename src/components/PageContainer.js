import '../styles/PageContainer.scss'

function PageContainer(props) {
    return (
        <div className='page-container'>
            <main className='page-body'>
                {props.children}
            </main>
        </div>
    )
}

export default PageContainer;