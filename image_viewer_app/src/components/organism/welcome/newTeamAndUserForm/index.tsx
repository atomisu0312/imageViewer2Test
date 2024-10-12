'use client'

import { makeMyFirstTeam } from "@/actions/account/team";
import SimpleForm from "@/components/molecule/simpleForm";
import { useFormState } from "react-dom";

/** ボタンオブジェクトを用意 */
const buttonComponent = ({ isActivate }): React.ReactNode => {
  return (<button disabled={!isActivate}>SUBMIT</button>)
};

/** 正直ただのボタンオブジェクトでもいい気がする */
const buttonComponent2 = (): React.ReactNode => {
  return (<button>SUBMIT</button>)
};

export default function NewTeamAndUserForm() {
  const initialState = { message: null, errors: {} };
  const makeMyFirstTeamBinded = makeMyFirstTeam.bind(null);
  const [errorMessage, dispatch] = useFormState(makeMyFirstTeamBinded, initialState);

  return (<>
    <SimpleForm
      formTitle={"新規にチームを作成したい方はこちらへ"}
      bgColor={"bg-green-500"} buttonComponent={buttonComponent2}
      formElements={[{
        elementName: "チーム名",
        elementId: "team_name",
        placeholder: "チーム名を入力",
        inputType: "text"
      }]}
      formAction={dispatch} />
  </>)
}