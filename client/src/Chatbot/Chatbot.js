import Axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveMessage } from "../_actions/message_actions";
import Message from "./sections/Message";
import Card from "./sections/Card";
import { List, Icon, Avatar } from "antd";

function Chatbot() {
	const messagesFromRedux = useSelector((state) => state.message.messages);
	const dispatch = useDispatch();
	useEffect(() => {
		eventQuery("welcomeToMyWebsite");
	}, []);

	const textQuery = async (text) => {
		let conversation = {
			who: "user",
			content: {
				text: {
					text,
				},
			},
		};
		dispatch(saveMessage(conversation));

		const textQueryVariables = {
			text,
		};
		try {
			const response = await Axios.post(
				"/api/dialogflow/textQuery",
				textQueryVariables
			);

			for (let content of response.data.fulfillmentMessages) {
				conversation = {
					who: "bot",
					content,
				};
			}
			dispatch(saveMessage(conversation));
		} catch (err) {
			conversation = {
				who: "bot",
				content: {
					text: {
						text: "Error occurred, Please try again later",
					},
				},
			};
			dispatch(saveMessage(conversation));
		}
	};

	const renderCards = (cards) => {
		return cards.map((card, i) => <Card key={i} cardInfo={card.structValue} />);
	};

	const renderOneMessage = (message, i) => {
		if (message.content && message.content.text) {
			return <Message message={message} index={i}></Message>;
		} else if (message.content && message.content.payload.fields.card) {
			const AvatarSrc =
				message.who === "bot" ? (
					<Icon type='robot'></Icon>
				) : (
					<Icon type='smile'></Icon>
				);
			return (
				<div>
					<List.Item style={{ padding: "1rem" }}>
						<List.Item.Meta
							avatar={<Avatar icon={AvatarSrc} />}
							title={message.who}
							description={renderCards(
								message.content.payload.fields.card.listValue.values
							)}
						/>
					</List.Item>
				</div>
			);
		}
	};

	const renderMessages = (returnedMessages) => {
		if (returnedMessages) {
			return returnedMessages.map((message, i) => {
				return renderOneMessage(message, i);
			});
		} else {
			return null;
		}
	};

	const eventQuery = async (event) => {
		const eventQueryVariables = {
			event,
		};
		try {
			const response = await Axios.post(
				"/api/dialogflow/eventQuery",
				eventQueryVariables
			);
			for (let content of response.data.fulfillmentMessages) {
				let conversation = {
					who: "bot",
					content,
				};

				dispatch(saveMessage(conversation));
			}
		} catch (err) {
			let conversation = {
				who: "bot",
				content: {
					text: {
						text: "Error occurred, Please try again later",
					},
				},
			};
			dispatch(saveMessage(conversation));
		}
	};

	const handleKeypress = (e) => {
		if (e.key === "Enter") {
			if (!e.target.value) {
				return alert("no Input!");
			} else textQuery(e.target.value);
			e.target.value = "";
		}
	};
	return (
		<div
			style={{
				height: 700,
				width: 700,
				border: "3px solid black",
				borderRadius: "7px",
			}}
		>
			<div style={{ height: 644, width: "100%", overflow: "auto" }}>
				{renderMessages(messagesFromRedux)}
			</div>
			<input
				style={{
					margin: 0,
					width: "100%",
					height: 50,
					borderRadius: "4px",
					padding: "5px",
					fontSize: "1rem",
				}}
				placeholder='Send a message...'
				onKeyPress={handleKeypress}
				type='text'
			/>
		</div>
	);
}

export default Chatbot;
