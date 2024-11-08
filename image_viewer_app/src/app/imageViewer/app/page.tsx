import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/imageViewer/app/image/view');
  return (<></>)
}