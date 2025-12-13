import {
  AlertDialog,
  AlertDialogContent,
} from "../../../../components/ui/alert-dialog";
import Image from "next/image";

const CustomeLoading = ({ loading }) => {
  return (
    <div>
      <AlertDialog open={loading}>
        <AlertDialogContent className=" flex flex-col items-center justify-center my-10" >
          <Image src="/load-time.gif" width={50} height={50} alt="Loading..." />
          <h2>Generating your video... Do not Refresh</h2>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomeLoading;
