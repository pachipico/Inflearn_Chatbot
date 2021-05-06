import React from "react";
import { List, Icon, Avatar } from "antd";

function Messages({ message, index }) {
	const AvatarSrc =
		message.who === "bot" ? (
			<Icon type='robot'></Icon>
		) : (
			<Icon type='smile'></Icon>
		);

	return (
		<List.Item key={index} style={{ padding: "1rem" }}>
			<List.Item.Meta
				avatar={<Avatar icon={AvatarSrc} />}
				title={message.who}
				description={message.content.text.text}
			/>
		</List.Item>
	);
}

export default Messages;
