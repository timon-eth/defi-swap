'use client'
import { columns } from "@/components/tables/pool-table/columns";
import { PoolTable } from "@/components/tables/pool-table/pool-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React, { useState, useEffect } from "react";

export default function Page() {
  const [tabledata, setTableData] = useState<any>([]);
  const [pageNo, setPageNo] = useState(1);
  const [count, setCount] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false); // State to track screen width
  const [maximized, setMaximized] = useState<boolean>(false); // State to track if the screen was maximized

  async function onPage() {
    setLoading(true);
    try {
      const response = await fetch("/api/analytics/pool", {
        method: "POST",
        body: JSON.stringify({ pageNo: pageNo }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        return 0;
      }
      const { data, count } = await response.json();
      let num = Math.ceil(count / 50);
      setCount(num);
      setTableData(data);
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768); // 768px is the breakpoint for 'md' in Tailwind
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    onPage();
  }, [pageNo]);

  const handleMaximize = () => {
    setMaximized(true);
    if (typeof window !== 'undefined') {
      window.resizeTo(screen.width, screen.height);
    }
  };

  return (
    <>
      {isSmallScreen && !maximized && (
        <AlertDialog open={isSmallScreen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Screen size is too small!</AlertDialogTitle>
              <AlertDialogDescription>
                Currently, the table cannot be displayed properly on resolutions smaller than 768px.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleMaximize}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <div className="space-y-4 p-4 w-full xl:w-2/3 mt-24 md:p-8 pt-6 flex flex-col items-center">
        <PoolTable
          columns={columns}
          data={tabledata}
          pageNo={setPageNo} // Pass pageNo directly
          totalUsers={0}
          pageCount={count} />
      </div>
    </>
  );
}
