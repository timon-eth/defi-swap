import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SearchContent = () => {
  return (
    <div className="p-4 lg:p-8 h-full flex items-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <AlertDialog>
          <AlertDialogContent className="bg-black-300">
            <AlertDialogHeader>
              <p className="text-[#00f0ff] text-xl">Sign In With Wallet</p>
              <AlertDialogDescription>
                Please set wallet
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
};

export default SearchContent;