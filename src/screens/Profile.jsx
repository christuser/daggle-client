import "./Profile.css";
import "../styles/dscard.css";
import React, { useEffect, useState } from "react";
import { Box, CircularProgress, TextField, Tooltip } from "@mui/material";
import { Navbar } from "../components/Navbar";
import { useParams } from "react-router-dom";
import { uploadDataset, userDatasets } from "../api/dataset";
import { BsDatabase } from "react-icons/bs";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { TbBoxModel2 } from "react-icons/tb";
import { Loader } from "../components/Loader";
import EmptyBox from "../assets/629-empty-box.gif";
import { CreateAccessTokenDialog } from "../components/CreateAccessTokenDialog";
import { toast } from "react-toastify";
import { getShortAddress } from "../utils/addressShort";
import { RxHalf2 } from "react-icons/rx";
import { TagsDialog } from "../components/TagsDialog";
import { DownloadButton } from "../components/DownloadButton";

export const Profile = () => {
	const [loading, setLoading] = useState(true);
	const [uploadLoading, setUploadLoading] = useState(false);
	const [menuIndex, setMenuIndex] = useState(0);
	const [datasets, setDatasets] = useState([]);
	const [file, setFile] = useState();
	const [name, setName] = useState("");
	const [version, setVersion] = useState("");
	const [description, setDescription] = useState("");
	const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
	const [selectedDatasetid, setSelectedDatasetid] = useState();
	const [selectedDatasetName, setSelectedDatasetName] = useState();
	const [tagsDialogOpen, setTagsDialogOpen] = useState(false);
	const [loggedInAddress, setLoggedInAddress] = useState();

	const { user } = useParams();

	async function getDatasets(user) {
		setLoading(true);
		setDatasets([]);
		const repos = await userDatasets(user);
		setDatasets(repos);
		setLoading(false);
	}

	function getLoggedAddress() {
		const address = localStorage.getItem("address");
		setLoggedInAddress(address);
	}

	async function uploadFile() {
		if (!loggedInAddress)
			return toast("Please connect your wallet.", { type: "info" });
		if (!file) return alert("Please select a file!");
		if (!name || name === "")
			return alert("Please enter a name for this dataset.");
		if (!version || version === "")
			return alert("Please enter a version for this dataset.");
		if (!description || description === "")
			return alert("Please enter a description for this dataset.");
		setUploadLoading(true);
		await uploadDataset(file, `${name}:${version}`, description);
		toast("Successfully uploaded your dataset", { type: "success" });
		setMenuIndex(0);
		setUploadLoading(false);
		getDatasets(user);
	}

	function handleTokenDialogClose() {
		setTokenDialogOpen(false);
	}

	function handleTagDialogClose() {
		setTagsDialogOpen(false);
	}

	useEffect(() => {
		getDatasets(user);
		getLoggedAddress();
	}, [user]);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					width: "100%",
					maxWidth: "960px",
				}}
			>
				<Navbar disableSearch={true} />
			</Box>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					width: "100%",
					maxWidth: "920px",
				}}
			>
				<Box className="profile">
					<Box className="profile-navigation">
						<Box
							onClick={() => setMenuIndex(0)}
							className={`item ${menuIndex === 0 ? "selected" : ""}`}
						>
							<p>Datasets</p>
							<BsDatabase />
						</Box>
						<Box
							onClick={() => setMenuIndex(1)}
							className={`item ${menuIndex === 1 ? "selected" : ""}`}
						>
							<p>Models</p>
							<TbBoxModel2 />
						</Box>
					</Box>

					<CreateAccessTokenDialog
						isOpen={tokenDialogOpen}
						handleExternalClose={handleTokenDialogClose}
						datasetId={selectedDatasetid}
						datasetName={selectedDatasetName}
					/>

					<TagsDialog
						name={name}
						isOpen={tagsDialogOpen}
						handleExternalClose={handleTagDialogClose}
					/>

					{menuIndex === 0 && (
						<Box sx={{ flex: 1, width: "100%" }}>
							{loading ? (
								<Loader />
							) : datasets.length === 0 ? (
								loggedInAddress === user ? (
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											padding: 2,
										}}
									>
										<Box
											sx={{
												textAlign: "center",
												border: "2px solid grey",
												borderStyle: "dotted",
												p: 4,
												backgroundColor: "#1b1c1d",
											}}
										>
											<h3
												style={{
													color: "grey",
												}}
											>
												You have 0 datasets, try uploading one.😃
											</h3>
											<AiOutlineCloudUpload size={80} />
											<Box
												style={{
													marginBottom: "16px",
												}}
											>
												<input
													type="file"
													name="file"
													id="file"
													onChange={(e) => setFile(e.target.files[0])}
												/>
											</Box>
											<Box sx={{ mt: 1 }}>
												<TextField
													placeholder="Enter dataset name"
													size="small"
													value={name}
													onChange={(e) => {
														setName(e.target.value);
													}}
													sx={{
														width: "100%",
													}}
													InputProps={{
														style: {
															color: "white",
															border: "1px solid white",
														},
													}}
												/>
												<TextField
													placeholder="Enter version"
													size="small"
													value={version}
													onChange={(e) => {
														setVersion(e.target.value);
													}}
													sx={{
														width: "100%",
														mt: 2,
														mb: 2,
													}}
													InputProps={{
														style: {
															color: "white",
															border: "1px solid white",
														},
													}}
												/>
												<TextField
													multiline
													rows={4}
													maxRows={4}
													placeholder="Enter description"
													size="small"
													value={description}
													onChange={(e) => {
														setDescription(e.target.value);
													}}
													sx={{
														width: "100%",
														mt: 2,
														mb: 2,
													}}
													InputProps={{
														style: {
															color: "white",
															border: "1px solid white",
														},
													}}
												/>
											</Box>
											<Box
												style={{
													backgroundColor: "#256afe",
													padding: "6px 16px",
													fontWeight: 500,
													borderRadius: "4px",
													cursor: "pointer",
												}}
												onClick={uploadFile}
											>
												{uploadLoading ? (
													<CircularProgress size={14} sx={{ color: "white" }} />
												) : (
													"Upload File"
												)}
											</Box>
										</Box>
									</Box>
								) : (
									<Box>User has 0 datasets</Box>
								)
							) : (
								<Box px={1}>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											justifyContent: "space-between",
											mb: 2,
										}}
									>
										<h1>Datasets</h1>
										{loggedInAddress && (
											<Box
												style={{
													backgroundColor: "#256afe",
													padding: "6px 16px",
													fontWeight: 500,
													borderRadius: "4px",
													cursor: "pointer",
												}}
												onClick={() => setMenuIndex(3)}
											>
												Upload File
											</Box>
										)}
									</Box>

									{datasets.map((d, i) => {
										const ds = d.data;
										return (
											<Box className="dscard" key={i}>
												<Box
													display="flex"
													alignItems={"center"}
													justifyContent={"space-between"}
												>
													<Box>
														<Box sx={{ display: "flex", alignItems: "center" }}>
															<h3>
																{getShortAddress(ds.name.split("/")[0])}/
																{ds.name.split("/")[1]}
															</h3>
															<Box className="tag" sx={{ ml: 2 }}>
																<RxHalf2
																	style={{
																		marginRight: "6px",
																		color: "#256afe",
																	}}
																/>
																{ds.version}
															</Box>
														</Box>
													</Box>
													<h5>
														Uploaded at {new Date(ds.timestamp).toDateString()}
													</h5>
												</Box>
												<Box>
													<p
														style={{
															fontWeight: "500",
															fontSize: "12px",
															marginTop: "4px",
															textDecoration: "underline",
															color: "white",
															cursor: "pointer",
														}}
														onClick={() => {
															setName(ds.name);
															setTagsDialogOpen(true);
														}}
													>
														view versions
													</p>
												</Box>
												{/* Description */}
												<Box mt={2} sx={{ color: "grey" }}>
													<p>
														{ds.description !== ""
															? ds.description
															: "No description"}
													</p>
												</Box>
												<Box
													display="flex"
													alignItems={"center"}
													sx={{
														marginTop: "12px",
														fontWeight: "600",
														fontSize: "12px",
													}}
												>
													<DownloadButton ds={ds} />
													{loggedInAddress === ds.creator &&
														!ds.tokenAccessEnabled && (
															<Tooltip
																title="Enable access to users."
																placement="top"
															>
																<p
																	className="access-enabled"
																	onClick={() => {
																		setSelectedDatasetid(ds.id);
																		setSelectedDatasetName(ds.name);
																		setTokenDialogOpen(true);
																	}}
																>
																	Create access token⚠️
																</p>
															</Tooltip>
														)}
												</Box>
											</Box>
										);
									})}
								</Box>
							)}
						</Box>
					)}
					{menuIndex === 1 && (
						<Box sx={{ flex: 1 }}>
							{loading ? (
								<Loader />
							) : (
								<Box
									sx={{
										width: "100%",
										alignItems: "center",
										flexDirection: "column",
										display: "flex",
										borderRadius: "8px",
										p: 3,
									}}
								>
									<img width={"100px"} src={EmptyBox} alt="empty box" />
									<h3
										style={{
											color: "grey",
											marginTop: "12px",
											textAlign: "center",
										}}
									>
										Models will be rolledd out in the next update😃
									</h3>
								</Box>
							)}
						</Box>
					)}
					{menuIndex === 3 && (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								padding: 2,
								width: "100%",
							}}
						>
							<Box
								sx={{
									textAlign: "center",
									border: "2px solid grey",
									borderStyle: "dotted",
									p: 4,
									backgroundColor: "#1b1c1d",
								}}
							>
								<h3
									style={{
										color: "grey",
									}}
								>
									Upload your dataset.😃
								</h3>
								<AiOutlineCloudUpload size={80} />
								<Box
									style={{
										marginBottom: "16px",
									}}
								>
									<input
										type="file"
										name="file"
										id="file"
										onChange={(e) => setFile(e.target.files[0])}
									/>
								</Box>
								<Box sx={{ mt: 1 }}>
									<TextField
										placeholder="Enter dataset name"
										size="small"
										value={name}
										onChange={(e) => {
											setName(e.target.value);
										}}
										sx={{
											width: "100%",
										}}
										InputProps={{
											style: {
												color: "white",
												border: "1px solid white",
											},
										}}
									/>
									<TextField
										placeholder="Enter version"
										size="small"
										value={version}
										onChange={(e) => {
											setVersion(e.target.value);
										}}
										sx={{
											width: "100%",
											mt: 2,
										}}
										InputProps={{
											style: {
												color: "white",
												border: "1px solid white",
											},
										}}
									/>
									<TextField
										multiline
										rows={4}
										maxRows={4}
										placeholder="Enter description"
										size="small"
										value={description}
										onChange={(e) => {
											setDescription(e.target.value);
										}}
										sx={{
											width: "100%",
											mt: 2,
											mb: 2,
										}}
										InputProps={{
											style: {
												color: "white",
												border: "1px solid white",
											},
										}}
									/>
								</Box>
								<Box
									style={{
										backgroundColor: "#256afe",
										padding: "6px 16px",
										fontWeight: 500,
										borderRadius: "4px",
										cursor: "pointer",
									}}
									onClick={uploadFile}
								>
									{uploadLoading ? (
										<CircularProgress size={14} sx={{ color: "white" }} />
									) : (
										"Upload File"
									)}
								</Box>
							</Box>
						</Box>
					)}
				</Box>
			</Box>
		</Box>
	);
};
