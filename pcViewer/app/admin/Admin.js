var Controller = require("../../core/Controller");
var View = require("../../core/View");

var crypto = require("crypto");
var fs = require("fs");

var AdminModel = require("./AdminModel");
var model = new AdminModel();


module.exports = Controller.extend({
	//name: "Admin",
	username: "admin",
	password: "admin",
	authorize: function(req) {
		return (
			req.session && 
			req.session.authorized && 
			req.session.authorized === true
		) || (
			req.body && 
			req.body.username === this.username && 
			req.body.password === this.password
		);
	},
	run : function(req, res, next){
		
		//------------------
		// 로그인 화면
		//------------------
		
		if (this.authorize(req) == false)
		{
			var view = new View(res, './admin/admin-login');
			view.render({
				title : 'Please login'
			});
			return;
		}
		
		//------------------
		// Admin 화면
		//------------------
		
		//console.log("session : ", req.session);
		req.session.authorized = true;
		req.session.save();

		// model 세팅
		model.create(req.db);
		
		// view 설정
		var view = new View(res, './admin/admin');
		
		/*
		res.writeHead(200, {'Conternt-type':'text/html', 'charset':'utf-8'});
		res.setEncoding('utf-8');
		res.end("<b>Admin Page : 아직 구성되지 않았습니다.</b>");
		*/
		/*
		// Template 호출
		view.render({
			title : 'Administration',
			content : 'Welcome to the control panel'
		});
		*/
		
		var self = this;
		self.del(req, function() {
			self.form(req, res, function(formMarkup) {
				self.list(function(listMarkup) {
					view.render({
						title: 'Administration',
						content: 'Welcome to the control panel',
						list: listMarkup,
						form: formMarkup
					});
				});
			});
		});
		
		
		
	},
	
	del: function(req, callback) {
		if(req.query && req.query.action === "delete" && req.query.id) {
			model.remove(req.query.id, callback);
		} else {
			callback();
		}
	},
	
	list: function(callback) {
		model.getlist(function(err, records) {
			var markup = '<table>';
			markup += '\
				<tr>\
					<td><strong>type</strong></td>\
					<td><strong>title</strong></td>\
					<td><strong>picture</strong></td>\
					<td><strong>actions</strong></td>\
				</tr>\
			';
			for(var i=0; record = records[i]; i++) {
				markup += '\
				<tr>\
					<td>' + record.type + '</td>\
					<td>' + record.title + '</td>\
					<td><img class="list-picture" src="' + record.picture + '" /></td>\
					<td>\
						<a href="/admin?action=delete&id=' + record.ID + '">delete</a>&nbsp;&nbsp;\
						<a href="/admin?action=edit&id=' + record.ID + '">edit</a>\
					</td>\
				</tr>\
			';
			}
			
			markup += '</table>';
			callback(markup);
		});
	},
	form: function(req, res, callback) {
		var returnTheForm = function() {
			
			if(req.query && req.query.action === "edit" && req.query.id) {
				model.getlist(function(err, records) {
					if(records.length > 0) {
						var record = records[0];
						res.render('./admin/admin-record', {
							ID: record.ID,
							text: record.text,
							title: record.title,
							type: '<option value="' + record.type + '">' + record.type + '</option>',
							picture: record.picture,
							pictureTag: record.picture != '' ? '<img class="list-picture" src="' + record.picture + '" />' : ''
						}, function(err, html) {
							callback(html);
						});
					} else {
						res.render('./admin/admin-record', {}, function(err, html) {
							callback(html);
						});
					}
				}, {ID: req.query.id});
			} else {
				res.render('./admin/admin-record', {}, function(err, html) {
					callback(html);
				});
			}
		};
		
		if(req.body && req.body.formsubmitted && req.body.formsubmitted === 'yes') {
			var data = {
				title: req.body.title,
				text: req.body.text,
				type: req.body.type,
				picture: this.handleFileUpload(req),
				ID: req.body.ID
			};
			model[req.body.ID != '' ? 'update' : 'insert'](data, function(err, objects) {
				returnTheForm();
			});
		} else {
			returnTheForm();
		}
	},

	handleFileUpload: function(req) {
		if(!req.files || !req.files.picture || !req.files.picture.name) {
			return req.body.currentPicture || '';
		}
		var data = fs.readFileSync(req.files.picture.path);
		var fileName = req.files.picture.name;
		var uid = crypto.randomBytes(10).toString('hex');
		
		// __dirname --> Admin.js 파일 위치임
		var dir = __dirname + "/../../public/asset_admin/uploads/" + uid;
		fs.mkdirSync(dir, '0777');
		fs.writeFileSync(dir + "/" + fileName, data);
		return '/asset_admin/uploads/' + uid + "/" + fileName;
	}
	
	
});



