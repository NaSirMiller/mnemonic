import ShortTextInput from "./ShortTextInput.tsx";
import "./FormComponents.css";

function FormContainer() {
    return (
        <div className="form-cont">
            <div className="form-title">
                Task
            </div>
            <div className="form-input-cont">
                <ShortTextInput valueParent={ "Task Name" }/>
                <ShortTextInput valueParent={ "Due Date" }/>
                <ShortTextInput valueParent={ "Estimated time needed to Complete task" }/>
                <ShortTextInput valueParent={ "Course" }/>
                <ShortTextInput valueParent={ "Category" }/>
                <ShortTextInput valueParent={ "Weight of category" }/>
                <div className="form-button">
                    SubmitTitle
                </div>
            </div>
           {/* <ShortTextInput />  */}
        </div>
    );
}

export default FormContainer;