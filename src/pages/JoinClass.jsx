import { Dialog, Slide } from "@mui/material";
 
import { Close } from "@mui/icons-material";
import React from "react";
import { CustomUseContext } from "../context/context";

const Transaction = React.forwardRef(function Transaction(props , ref)
{
		return <Slide direction="up" ref={ref} {...props} />
})

function JoinClass() {
	const { joinClassDialog, setJoinClassDialog } = CustomUseContext();
	return (
		<div>
			<div>
				<Dialog
					fullScreen
					open={joinClassDialog}
					onClose={() => setJoinClassDialog(false)}
					TransitionComponent={Transaction}>
					<div>
					<div className="p-5 bg-slate-200" onClick={() => setJoinClassDialog(false)}>
						<Close />
						</div>
						<div>
						<h1 className="text-3xl font-bold text-center">Join Class</h1>\
						<form className="flex flex-col items-center justify-center p-5">
							<input
							type="text"
							placeholder="Enter Class Code"
							className="w-96 h-10 p-2 border border-gray-400 rounded-lg"
							/>
							<button
							type="submit"
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px
							-4 rounded"
							>
								Join Class
							</button>
						</form>

						</div>
					</div>
				</Dialog>
			</div>
		</div>
	);
}
export default JoinClass;