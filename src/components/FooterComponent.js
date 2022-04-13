import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FooterComponent() {
    return (
        <div className="center-text">
            <span>
                Developed with <FontAwesomeIcon icon={faHeart} /> by Elbert Cheng.
            </span>
        </div>
    )
}