
/*
 * GET home page.
 */

exports.index = function(req, res)
	{
		res.render(
			'index',
			{ 
				title: 'Express',
				tagSample: '<font color="red">Hello?</font>'
			}
		);
	};

// main.jade를 랜더링하도록 지정함
exports.main = function(req, res)
	{
		res.render(
			'mainView', 
			{
				title: 'Bingo!',
				username: req.query.username // query문에서 추출된 값 전달 (예 : main?username=test2)
			}
		);
	};